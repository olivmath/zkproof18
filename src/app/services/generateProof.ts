import { toast } from "sonner";
import { MessageSSE, MessageTypeSSE } from "../utils/types";

export interface ProofProgress {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  message: string;
}

export interface ProofResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const generateProof = async (
  birthYear: number,
  onProgress?: (progress: ProofProgress) => void
): Promise<ProofResult> => {
  const BACKEND = "http://127.0.0.1:3001";
  
  const steps = [
    "Configurando sessão...",
    "Carregando circuito...",
    "Gerando witness...",
    "Gerando prova criptográfica...",
    "Gerando chave de verificação...",
    "Verificando prova localmente...",
    "Submetendo para blockchain...",
    "Finalizando transação..."
  ];
  
  const totalSteps = steps.length;
  let currentStep = 0;

  const updateProgress = (stepName: string, message: string) => {
    currentStep++;
    onProgress?.({
      currentStep,
      totalSteps,
      stepName,
      message
    });
  };

  try {
    // Etapa 1: Configurando sessão
    updateProgress(steps[0], "Inicializando bibliotecas...");
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    
    // Etapa 2: Carregando circuito
    updateProgress(steps[1], "Baixando circuito...");
    const res = await fetch("/circuit.json");
    const circuit = await res.json();
    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    // Etapa 3: Gerando witness
    updateProgress(steps[2], "Calculando witness...");
    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: 2025,
    });

    // Etapa 4: Gerando prova
    updateProgress(steps[3], "Gerando prova criptográfica...");
    const { proof, publicInputs } = await backend.generateProof(witness);

    // Etapa 5: Gerando chave de verificação
    updateProgress(steps[4], "Gerando chave de verificação...");
    const vk = await backend.getVerificationKey();

    // Etapa 6: Verificando prova localmente
    updateProgress(steps[5], "Verificando prova localmente...");
    const localVerification = await backend.verifyProof({proof, publicInputs});
    if (!localVerification) {
      throw new Error("Falha na verificação local da prova");
    }

    // Etapa 7: Submetendo para blockchain
    updateProgress(steps[6], "Enviando prova para blockchain...");
    
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
      const errorText = await response.text();
      throw new Error(`Falha ao enviar prova: ${errorText}`);
    }

    const result = await response.json();
    
    // Etapa 8: Finalizando
    updateProgress(steps[7], "Transação finalizada!");
    
    if (result.response && result.response.txId) {
      toast.success("✅ Prova enviada com sucesso para a blockchain zkVerify!");
      return {
        success: true,
        txHash: result.response.txId
      };
    } else {
      throw new Error("Resposta inválida do servidor");
    }

  } catch (err: any) {
    toast.error("Erro ao gerar prova: " + err.message);
    console.error("💔 Proof generation failed:", err);
    return {
      success: false,
      error: err.message
    };
  }
}; 