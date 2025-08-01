import dotenv from "dotenv";
import { serverLog } from "../utils/serverLogger";

export const generateProof = async (birthYear: number, onProgress?: (progress: number, text: string) => void) => {
  dotenv.config();
  const BACKEND = process.env.BACKEND || "https://zk-backend-production.up.railway.app/api/verify";
  
  try {
    onProgress?.(10, "Loading circuit...");
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    const res = await fetch("/circuit.json");

    onProgress?.(25, "Initializing circuit...");
    const circuit = await res.json();
    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    // Use current year dynamically
    const currentYear = new Date().getFullYear();
    
    // Validate inputs before generating proof
    const age = currentYear - birthYear;
    if (age < 18 || age > 100) {
      throw new Error(`Age must be between 18 and 100 years. Current age: ${age}`);
    }

    onProgress?.(40, "Generating witness...");
    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: currentYear,
    });

    onProgress?.(60, "Generating proof...");
    const { proof, publicInputs } = await backend.generateProof(witness);
    const vk = await backend.getVerificationKey();

    onProgress?.(80, "Submitting to blockchain...");
    try {      
      const response = await fetch(BACKEND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicInputs: publicInputs[0],
          proof: Array.from(proof),
          vk: Array.from(vk),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      serverLog.info("✅ Backend response received", result);
      
      // Retornar proofCode em vez de txHash
      return {
        proofCode: result.proofCode || result.txHash, // fallback para compatibilidade
        verified: result.verified,
        message: result.message
      };
    } catch (err: any) {
      serverLog.error("❌ Backend request failed", err);
      throw new Error(err.message || "Failed to submit proof to blockchain");
    }
  } catch (err: any) {
    serverLog.error("💔 Proof generation failed", err);
    throw new Error(err.message || "Proof generation failed");
  }
};