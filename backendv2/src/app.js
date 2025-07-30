// app.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import { UltraPlonkBackend } from "@aztec/bb.js";
import { zkVerifySession, ZkVerifyEvents } from "zkverifyjs";

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());



// Load ZkVerify account
let session;
try {
  const SEED = process.env.SEED;
  session = await zkVerifySession.start().Volta().withAccount(SEED);
  const accountInfo = await session.getAccountInfo();

  console.log(`✅ zkVerify session initialized successfully:`);
  console.log(`  Address: ${accountInfo[0].address}`);
  console.log(`  Nonce: ${accountInfo[0].nonce}`);
  console.log(`  Free Balance: ${accountInfo[0].freeBalance} ACME`);
} catch (error) {
  console.error("❌ Failed to initialize zkVerify session:", error);
  process.exit(1);
}

// Rota POST
app.post("/api/verify", async (req, res) => {
  try {
    console.log("1. receive request");
    const input = req.body;

    console.log("2. validate input");
    if (!input || !input.publicInputs || !input.proof || !input.vk) {
      return res.status(400).json({
        error: "Invalid proof data",
      });
    }

    console.log("3. load circuit");
    const circuitFile = await import("../public/circuit.json");
    const circuit = circuitFile.default;

    console.log("4. convert data to array");
    const publicInputs = input.publicInputs
    const proofUint8Array = new Uint8Array(Object.values(input.proof));
    const vkUint8Array = new Uint8Array(Object.values(input.vk));

    console.log("Converted data:", {
      proofUint8Array: proofUint8Array.length,
      publicInputs,
      vkUint8Array: vkUint8Array.length,
    });

    console.log("5. verify proof");
    const backend = new UltraPlonkBackend(circuit.bytecode);
    const result = await backend.verifyProof({
      proof: proofUint8Array,
      publicInputs: publicInputs,
    });

    if (!result) {
      return res.status(400).json({
        error: "Proof verification failed",
      });
    }

    res.status(200).json({
      message: "Proof verified successfully!",
      verified: true,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      error: "Proof verification error",
      message: error.message,
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
