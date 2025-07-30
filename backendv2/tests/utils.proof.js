export const generateProof = async (birthYear) => {
  // 1. import
  const { UltraPlonkBackend } = await import("@aztec/bb.js");
  const { Noir } = await import("@noir-lang/noir_js");

  // 2. load circuit
  const res = "./circuit.json";
  const circuit = await res.json();

  // 3. setup
  const noir = new Noir(circuit);
  const backend = new UltraPlonkBackend(circuit.bytecode);

  // 4. pre-validate input
  const age = currentYear - birthYear;
  if (age < 18 || age > 100) {
    throw new Error(
      `Age must be between 18 and 100 years. Current age: ${age}`
    );
  }

  // 5. generate witness
  const currentYear = new Date().getFullYear();
  const { witness } = await noir.execute({
    birth_year: birthYear,
    current_year: currentYear,
  });

  // 6. generate proof
  const { proof, publicInputs } = await backend.generateProof(witness);

  // 7. get verification key
  const vk = await backend.getVerificationKey();

  // 8. verify proof
  const result = await backend.verifyProof({ proof, publicInputs });
  if (!result) {
    throw new Error("Proof verification failed");
  }

  return {
    publicInputs: publicInputs,
    proof: proof,
    vk: vk,
  };
};
