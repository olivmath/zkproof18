export const generateProof = async (birthYear) => {
  console.log("1. import")
  const { UltraPlonkBackend } = await import("@aztec/bb.js");
  const { Noir } = await import("@noir-lang/noir_js");

  console.log("2. load circuit")
  const res = await import("../public/circuit.json");
  const circuit = res.default;

  console.log("3. setup")
  const noir = new Noir(circuit);
  const backend = new UltraPlonkBackend(circuit.bytecode);

  console.log("4. pre-validate input")
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  if (age < 18 || age > 100) {
    throw new Error(
      `Age must be between 18 and 100 years. Current age: ${age}`
    );
  }

  console.log("5. generate witness")
  const { witness } = await noir.execute({
    birth_year: birthYear,
    current_year: currentYear,
  });

  console.log("6. generate proof")
  const { proof, publicInputs } = await backend.generateProof(witness);

  
  console.log("7. get verification key")
  const vk = await backend.getVerificationKey();

  console.log({
    proof, 
    publicInputs,
    vk
  })

  console.log("8. verify proof")
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
