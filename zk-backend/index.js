import express from "express";
import cors from "cors";
import { UltraPlonkBackend } from "@aztec/bb.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { zkVerifySession, ZkVerifyEvents } from "zkverifyjs";

// Configuration
const SEED = process.env.SEED || 'cry twist toddler village rug cradle hammer immense boost sunset butter situate';

// Initialize zkVerify session
let session;
try {
  session = await zkVerifySession.start().Volta().withAccount(SEED);
  const accountInfo = await session.getAccountInfo()

  console.log(`✅ zkVerify session initialized successfully:`);
  console.log(`  Address: ${accountInfo[0].address}`);
  console.log(`  Nonce: ${accountInfo[0].nonce}`);
  console.log(`  Free Balance: ${accountInfo[0].freeBalance} ACME`);
} catch (error) {
  console.error("❌ Failed to initialize zkVerify session:", error);
  process.exit(1);
}

// Corrigindo __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
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

// Store connected clients
const clients = new Set();

// Middleware to handle SSE connections
app.get("/sse", (req, res) => {
  console.log('New SSE client connected');
  
  // Set headers for SSE
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send initial connection message
  res.write('data: Connected\n\n');
  
  // Add client to the set
  const clientId = Date.now();
  clients.add({ id: clientId, res });
  
  // Handle client disconnect
  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients.delete({ id: clientId, res });
  });
});

// Function to send messages to all connected clients
const sendSSEMessage = (message, type = 'info') => {
  const messageObj = typeof message === 'string' 
    ? { type, message } 
    : { type, ...message };
    
  const data = JSON.stringify(messageObj);
  
  clients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
    } catch (error) {
      console.error('Error sending SSE message:', error);
      clients.delete(client);
    }
  });
};

// POST - Submissão da prova
app.post("/", async (req, res) => {
  const { convertProof, convertVerificationKey } = await import('../pkg/olivmath_ultraplonk_zk_verify.js');
  try {
    sendSSEMessage("📩 Recebi a requisição para submeter prova...");

    const { proof, publicInputs, vk } = req.body;

    if (!proof || !publicInputs || !vk) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes: proof, publicInputs, vk",
      });
    }

    // Convertendo proof e vk para Uint8Array
    const proofUint8Array = new Uint8Array(Object.values(proof));
    const vkUint8Array = new Uint8Array(Object.values(vk));

    console.log("proofArray", proofUint8Array);
    console.log("vkArray", vkUint8Array);
    console.log("publicInputs", publicInputs);

    // Carrega o circuito do disco
    const circuitPath = path.join(__dirname, "../public/circuit.json");
    const circuit = JSON.parse(fs.readFileSync(circuitPath, "utf-8"));
    const backend = new UltraPlonkBackend(circuit.bytecode);

    sendSSEMessage("Verificando prova...");
    const result = await backend.verifyProof({
      proof,
      publicInputs: [publicInputs],
    });
    console.log("Result", result);
    if (result === false) {
      return res.status(400).json({ error: "Falha na verificação da prova" });
    }
    
    // Convert to hex using ultraplonk
    const proofHex = convertProof(proofUint8Array, 1);
    const vkHex = convertVerificationKey(vkUint8Array);

    const response = await submitProofToZkVerify(proofHex, publicInputs, vkHex);

    return res.status(200).json({
      message: "Prova enviada com sucesso",
      response,
    });
  } catch (err) {
    const errorMessage = `❌ Erro ao submeter prova: ${err.message}`;
    console.error(errorMessage, err);
    sendSSEMessage({
      type: 'error',
      message: 'Falha ao processar a prova',
      details: err.message
    });
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
  if (!session) {
    throw new Error("zkVerify session not initialized");
  }


  sendSSEMessage("Enviando prova zkVerify...");
  console.log("ProofHex", proofHex);
  console.log("vkHex", vkHex);
  console.log("publicInputs", [publicInputs]);  
  const { events } = await session
    .verify()
    .ultraplonk()
    .execute({
      proofData: { proof: proofHex, vk: vkHex, publicSignals: [publicInputs] },
    });

  await new Promise((resolve) => {
    events.on(ZkVerifyEvents.Finalized, (data) => {
      console.log("Proof finalized on zkVerify. ✅", data);
      resolve(data);
    });
  });

  return { status: "ok", txId: "0x123abc" };
};
