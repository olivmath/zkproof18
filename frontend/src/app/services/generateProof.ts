import { serverLog } from "../utils/serverLogger";

export const generateProof = async (
  birthYear: number,
  onProgress?: (progress: number, text: string) => void
) => {
  const BACKEND = "https://zkproof18.onrender.com/api/verify";

  try {
    onProgress?.(10, "Loading circuit...");
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    const res = await fetch("/circuit.json");

    onProgress?.(25, "Initializing circuit...");
    const circuit = await res.json();
    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    const currentYear = new Date().getFullYear();

    const age = currentYear - birthYear;
    if (age < 18 || age > 100) {
      throw new Error(
        `Age must be between 18 and 100 years. Current age: ${age}`
      );
    }

    onProgress?.(40, "Generating witness...");
    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: currentYear,
    });

    onProgress?.(60, "Generating proof...");
    let genSeconds = 0;
    const genTotal = 4;
    const genIntervalId = setInterval(() => {
      genSeconds = Math.min(genSeconds + 1, genTotal);
      onProgress?.(60, `Generating proof ${genSeconds}s/≈${genTotal}s...`);
      if (genSeconds >= genTotal) {
        clearInterval(genIntervalId);
      }
    }, 1000);

    const { proof, publicInputs } = await backend.generateProof(witness);
    const vk = await backend.getVerificationKey();
    clearInterval(genIntervalId);

    onProgress?.(80, "Submitting to blockchain...");
    let subSeconds = 0;
    const subTotal = 50;
    const submitIntervalId = setInterval(() => {
      subSeconds = Math.min(subSeconds + 1, subTotal);
      onProgress?.(80, `Submitting to blockchain ${subSeconds}s/≈${subTotal}s...`);
      if (subSeconds >= subTotal) {
        clearInterval(submitIntervalId);
      }
    }, 1000);
    const controller = new AbortController();
    const twoMin = 120000;
    const timeoutId = setTimeout(() => controller.abort(), twoMin);

    try {
      const response = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicInputs: publicInputs[0],
          proof: Array.from(proof),
          vk: Array.from(vk),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } finally {
      clearTimeout(timeoutId);
      clearInterval(submitIntervalId);
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      serverLog.error("⏱️ Request timeout after 2 minutes");
      throw new Error("Request timed out after 2 minutes");
    }
    serverLog.error("❌ Backend request failed", err);
    throw new Error(err.message || "Failed to submit proof to blockchain");
  }
};
