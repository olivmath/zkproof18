import dotenv from "dotenv";


export const generateProof = async (birthYear: number) => {
  dotenv.config();
  const BACKEND = process.env.BACKEND || "https://zk-backend-production.up.railway.app/api/verify";
  // const BACKEND = "http://localhost:3001/api/verify";
  console.log(">>>>>BACKEND")
  console.info(BACKEND)
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
      const response = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicInputs: publicInputs[0],
          proof: Array.from(proof),
          vk: Array.from(vk),
        }),
      });

      console.log("🔍 Backend response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("🔍 Backend response data:", responseData);
      console.log("🔍 txHash value:", responseData.txHash);
      console.log("🔍 txHash type:", typeof responseData.txHash);
      
      return responseData;
    } catch (err: any) {
      console.error("❌ Backend request failed:", err);
      throw new Error(err.message || "Failed to submit proof to blockchain");
    }
  } catch (err: any) {
    console.error("💔 Proof generation failed:", err);
    throw new Error(err.message || "Proof generation failed");
  }
};