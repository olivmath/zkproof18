// app.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import { convertProof, convertVerificationKey } from "olivmath-ultraplonk-zk-verify";
import { zkVerifySession, ZkVerifyEvents } from "zkverifyjs";
import { UltraPlonkBackend } from "@aztec/bb.js";

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Load ZkVerify account
let session;
let accountInfo;
try {
  const SEED = process.env.SEED;
  session = await zkVerifySession.start().Volta().withAccount(SEED);
  accountInfo = await session.getAccountInfo();

  console.log(`✅ zkVerify session initialized successfully:`);
  console.log(`  Address: ${accountInfo[0].address}`);
  console.log(`  Nonce: ${accountInfo[0].nonce}`);
  console.log(`  Free Balance: ${accountInfo[0].freeBalance} ACME`);
} catch (error) {
  console.error("❌ Failed to initialize zkVerify session:", error);
  process.exit(1);
}


app.post("/api/verify", async (req, res) => {
  try {
    // ###############################################################
    console.log("1. receive request");
    const { proof, publicInputs, vk } = req.body;
    
    // ###############################################################
    console.log("2. validate input");
    if (!publicInputs || !proof || !vk) {
      return res.status(400).json({
        error: "Invalid proof data",
      });
    }
    
    // ###############################################################
    console.log("3. convert data to array");
    const proofUint8Array = new Uint8Array(Object.values(proof));
    const vkUint8Array = new Uint8Array(Object.values(vk));
    
    // ###############################################################
    console.log("4. load circuit");
    const circuitFile = await import("../public/circuit.json");
    const circuit = circuitFile.default;
    const backend = new UltraPlonkBackend(circuit.bytecode);
    
    // ###############################################################
    console.log("5. verify proof");
    const result = await backend.verifyProof({
      proof: proofUint8Array,
      publicInputs: publicInputs,
    });
    
    if (!result) {
      return res.status(400).json({
        error: "Proof verification failed",
      });
    }
    
    // ###############################################################
    console.log("6. convert proof and vk to hex");
    const proofHex = convertProof(proofUint8Array);
    const vkHex = convertVerificationKey(vkUint8Array);
    
    // ###############################################################
    console.log("7. submit to zkVerify");
    const { events } = await session
    .verify()
    .ultraplonk({ numberOfPublicInputs: 1 })
    .execute({
      proofData: {
        vk: vkHex,
        proof: proofHex,
        publicSignals: publicInputs
      },
    });
    
    // ###############################################################
    console.log("8. wait for zkVerify response");
    return new Promise((resolve, reject) => {
      events.once("includedInBlock", (info) => {
        console.log("Transaction included in block:", info);
      });
      
      events.once(ZkVerifyEvents.Error, (err) => {
        console.error("Error in zkVerify transaction:", err);
        reject(res.status(500).json({
          error: "zkVerify transaction failed",
          message: err.message,
        }));
      });
      
      events.once(ZkVerifyEvents.Finalized, (data) => {
        console.log("Proof finalized on zkVerify ✅");
        resolve(res.status(200).json({
          message: "Proof verified successfully!",
          verified: true,
          txhash: data.txhash,
        }));
      });
    });
    // ###############################################################
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
