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

const SEED = process.env.SEED;


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



// POST - Submissão da prova
app.post("/", async (req, res) => {
  try {
    console.log("📩 Recebi a requisição para submeter prova...");

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
    const circuitPath = path.join(__dirname, "./public/circuit.json");
    const circuit = JSON.parse(fs.readFileSync(circuitPath, "utf-8"));
    const backend = new UltraPlonkBackend(circuit.bytecode);

    console.log("Verificando prova...");
    const result = await backend.verifyProof({
      proof: proofUint8Array,
      publicInputs: [publicInputs],
    });
    console.log("Resultado da verificação: ", result);

    if (result === false) {
      return res.status(400).json({ error: "Falha na verificação da prova" });
    }

    const proofHex = Buffer.from(Object.values(proof)).toString("hex");
    const vkHex = Buffer.from(Object.values(vk)).toString("hex");

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

  console.table({ proofHex, publicInputs, vkHex });

  const { events } = await session
    .verify()
    .ultraplonk()
    .execute({
      proofData: { proof: proofHex, vk: vkHex, publicSignals: publicInputs },
    });

  await new Promise((resolve) => {
    events.on(ZkVerifyEvents.Finalized, (data) => {
      console.log("Proof finalized on zkVerify. ✅", data);
      resolve(data);
    });
  });

  return { status: "ok", txId: "0x123abc" };
};
