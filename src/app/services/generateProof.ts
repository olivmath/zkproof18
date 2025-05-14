import { toast } from "sonner";

export const generateProof = async (birthYear: number) => {
  const { UltraPlonkBackend } = await import("@aztec/bb.js");
  const { Noir } = await import("@noir-lang/noir_js");
  try {
    const res = await fetch("/circuit.json");
    const circuit = await res.json();
    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    toast.success("Sessão configurada");

    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: 2025,
    });
    toast.success("Witness gerado");

    const t1 = toast.loading("Gerando prova...");
    const { proof, publicInputs } = await backend.generateProof(witness);
    toast.success("Prova gerada");
    toast.dismiss(t1);

    const t2 = toast.loading("Gerando chave de verificação...");
    const vk = await backend.getVerificationKey();
    toast.dismiss(t2);
    toast.success("Verificação de chave gerada");

    const t3 = toast.loading("Submetendo provas para backend...");
    await fetch("/api/submit-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proof,
        publicInputs: publicInputs[0],
        vk,
      }),
    });
    toast.dismiss(t3);
  } catch (err) {
    toast.error("Erro ao gerar prova");
    console.error("💔 Proof generation failed:", err);
  }
};
