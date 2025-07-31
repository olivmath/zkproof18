import dotenv from "dotenv";
dotenv.config();

export const generateProof = async (birthYear: number) => {
  const BACKEND = process.env.BACKEND || "https://zk-backend-production.up.railway.app";
  try {
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    const res = await fetch("/circuit.json");

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

    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: currentYear,
    });

    const { proof, publicInputs } = await backend.generateProof(witness);
    const vk = await backend.getVerificationKey();

    try {
      const result = await backend.verifyProof({ proof, publicInputs });

      console.log("📤 Enviando prova para o backend...");
      console.log("publicInputs:", publicInputs[0]);
      console.log("publicInputs type:", typeof publicInputs[0]);
      console.log("proof length:", proof.length);
      console.log("vk length:", vk.length);
      
      const response = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicInputs: publicInputs[0],
          proof: Array.from(proof),
          vk: Array.from(vk),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (err: any) {
      throw new Error(err.message || "Failed to submit proof to blockchain");
    }
  } catch (err: any) {
    console.error("💔 Proof generation failed:", err);
    throw new Error(err.message || "Proof generation failed");
  }
};