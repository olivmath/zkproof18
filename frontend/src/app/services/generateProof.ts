export const generateProof = async (birthYear: number) => {
  const BACKEND = "http://localhost:3001";
  try {
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    const res = await fetch("/circuit.json");

    const circuit = await res.json();
    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: 2025,
    });

    const { proof, publicInputs } = await backend.generateProof(witness);
    const vk = await backend.getVerificationKey();

    try {
      const result = await backend.verifyProof({ proof, publicInputs });

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
        console.error("Falha ao enviar prova");
        console.error(response.text);
        return;
      }
    } catch (err: any) {
      return;
    }
  } catch (err: any) {
    console.error("💔 Proof generation failed:", err);
  }
};
