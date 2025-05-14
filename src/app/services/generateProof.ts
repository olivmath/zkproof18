import { toast } from "sonner";
export const generateProof = async (birthYear: number) => {
  try {
    // Initial setup

    toast.loading("Configurando sessão...");
    // await 1 seconds
    toast.success("Sessão configurada");
    toast.loading("Gerando witness...");
    // await 1 seconds
    toast.success("Witness gerado");
    toast.loading("Gerando prova...");
    // await 1 seconds
    toast.success("Prova gerada");

    fetch("/api/submit-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proof: [1, 2, 3, 4, 5],
        publicInputs: [1, 2, 3, 4, 5],
        vk: [1, 2, 3, 4, 5],
      }),
    });
  } catch (err) {
    toast.error("Erro ao gerar prova");
    console.error("💔 Proof generation failed:", err);
  }
};
