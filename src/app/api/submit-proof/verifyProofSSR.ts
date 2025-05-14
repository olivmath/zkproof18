export async function verifyProof(backend, proof) {
  const result = await backend.verifyProof(proof);
  return result;
}
