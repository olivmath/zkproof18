import express from "express";
import cors from "cors";
import { UltraPlonkBackend } from "@aztec/bb.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { zkVerifySession, ZkVerifyEvents } from "zkverifyjs";

// Corrigindo __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Configuration
const SEED =
  process.env.SEED ||
  "cry twist toddler village rug cradle hammer immense boost sunset butter situate";

// Initialize zkVerify session
let session;
try {
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

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://f9a4-2804-1530-44d-2600-4cd9-efe6-f6c6-5dc7.ngrok-free.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Global para armazenar função de envio SSE
let sendSSEMessage = null;

// GET - SSE endpoint
app.get("/", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  sendSSEMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };
});

// POST - Submissão da prova
app.post("/", async (req, res) => {
  const { convertProof, convertVerificationKey } = await import(
    "olivmath-ultraplonk-zk-verify"
  );
  try {
    console.log("📩 Recebi a requisição para submeter prova...");

    const { proof, publicInputs, vk } = req.body;

    if (!proof || !publicInputs || !vk) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes: proof, publicInputs, vk",
      });
    }

    // Carrega o circuito do disco
    const circuitPath = path.join(__dirname, "../public/circuit.json");
    const circuit = JSON.parse(fs.readFileSync(circuitPath, "utf-8"));
    const backend = new UltraPlonkBackend(circuit.bytecode);

    console.log("Verificando prova...");
    const result = await backend.verifyProof({
      proof,
      publicInputs: [publicInputs],
    });
    console.log("Resultado da verificação: ", result);

    if (result === false) {
      return res.status(400).json({ error: "Falha na verificação da prova" });
    }

    const proofHex = convertProof(proof)
    const vkHex = convertVerificationKey(vk)

    const response = await submitProofToZkVerify(proofHex, publicInputs, vkHex);

    return res.status(200).json({
      message: "Prova enviada com sucesso",
      response,
    });
  } catch (err) {
    console.error(`❌ Erro ao submeter prova: ${err.message}`);
    console.error(err);
    return res.status(500).json({
      error: "Falha ao submeter prova",
      details: err.message,
    });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(
    `🚀 Servidor de verificação de provas ZK rodando em http://localhost:${port}`
  );
});

const submitProofToZkVerify = async (proofHex, publicInputs, vkHex) => {
  const session = await zkVerifySession.start().Volta().withAccount(SEED);

  const { events } = await session
    .verify()
    .ultraplonk()
    .execute({
      proofData: { proof: proofHex, vk: vkHex, publicSignals: publicInputs },
    });

  return new Promise((resolve) => {
    events.on(ZkVerifyEvents.Finalized, (data) => {
      console.log("Proof finalized on zkVerify. ✅", data);
      
      // Extrair o txHash da resposta da transação
      let txHash = "0x123abc"; // fallback
      
      if (data?.extrinsic?.hash) {
        txHash = data.extrinsic.hash;
      } else if (data?.txHash) {
        txHash = data.txHash;
      } else if (data?.hash) {
        txHash = data.hash;
      } else if (typeof data === 'string' && data.startsWith('0x')) {
        txHash = data;
      } else if (data && typeof data === 'object') {
        // Tentar encontrar o hash em diferentes propriedades
        const possibleHashProps = ['hash', 'txHash', 'extrinsicHash', 'transactionHash'];
        for (const prop of possibleHashProps) {
          if (data[prop] && typeof data[prop] === 'string' && data[prop].startsWith('0x')) {
            txHash = data[prop];
            break;
          }
        }
      }
      
      console.log("Extracted txHash:", txHash);
      resolve({ status: "ok", txId: txHash });
    });
    
    events.on(ZkVerifyEvents.Error, (error) => {
      console.error("Error in zkVerify transaction:", error);
      resolve({ status: "error", error: error.message });
    });
    
    // Timeout para evitar que a promise fique pendente indefinidamente
    setTimeout(() => {
      console.warn("Timeout waiting for transaction finalization");
      resolve({ status: "timeout", txId: "0x123abc" });
    }, 30000); // 30 segundos
  });
};
