import { toast } from "sonner";

// Function to setup SSE connection
const setupSSEConnection = (onMessage: (data: any) => void) => {
  // Close any existing connection
  if ((window as any).eventSource) {
    (window as any).eventSource.close();
  }

  const eventSource = new EventSource('http://localhost:3001/sse');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Handle different message types
      switch (data.type) {
        case 'error':
          toast.error(data.message || 'Ocorreu um erro');
          if (data.details) {
            console.error('Detalhes do erro:', data.details);
          }
          break;
          
        case 'info':
          toast.info(data.message);
          break;
          
        case 'success':
          toast.success(data.message);
          break;
          
        default:
          console.log('Mensagem SSE:', data);
      }
      
      // Forward the message to the callback
      onMessage(data);
    } catch (error) {
      console.error('Erro ao processar mensagem SSE:', error, event.data);
    }
  };

  eventSource.onerror = (error) => {
    console.error('Erro na conexão SSE:', error);
    toast.error('Erro na conexão com o servidor');
    eventSource.close();
  };

  (window as any).eventSource = eventSource;
  return eventSource;
};

export const generateProof = async (birthYear: number) => {
  let id;
  try {
    id = toast.loading("Configurando sessão...");
    console.log("[INFO] Iniciando configuração da sessão para geração de prova.");
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    const res = await fetch("/circuit.json");

    if (!res.ok) {
      toast.error("Erro ao carregar circuito. Tente novamente mais tarde.");
      console.error("[ERRO] Falha ao buscar /circuit.json", res.status, res.statusText);
      return;
    }

    const circuit = await res.json();
    console.log("[DEBUG] Circuito carregado:", circuit);
    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    toast.dismiss(id);
    toast.success("Sessão configurada com sucesso!");
    console.log("[INFO] Sessão configurada com sucesso.");

    toast.loading("Executando circuito para gerar witness...");
    const currentYear = new Date().getFullYear();
    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: currentYear,
    });
    toast.dismiss();
    toast.success("Witness gerado com sucesso!");
    console.log("[DEBUG] Witness gerado:", witness);

    id = toast.loading("Gerando prova criptográfica...");
    const { proof, publicInputs } = await backend.generateProof(witness);
    toast.dismiss(id);
    toast.success("Prova gerada com sucesso!");
    console.log("[DEBUG] Prova gerada:", proof);
    console.log("[DEBUG] Public inputs:", publicInputs);

    id = toast.loading("Gerando chave de verificação...");
    const vk = await backend.getVerificationKey();
    toast.dismiss(id);
    toast.success("Chave de verificação gerada!");
    console.log("[DEBUG] Chave de verificação (vk) gerada:", vk);

    toast.success("✅ Seus dados estão seguros 🔐");
    id = toast.loading("Verificando prova localmente...");

    const verificationResult = await backend.verifyProof({ proof, publicInputs });
    toast.dismiss(id);
    if (verificationResult) {
      toast.success("Prova verificada localmente com sucesso!");
      console.log("[INFO] Prova verificada localmente: ", verificationResult);
    } else {
      toast.error("Falha na verificação local da prova.");
      console.error("[ERRO] Falha na verificação local da prova.");
      return;
    }

    // Setup SSE connection for real-time updates
    setupSSEConnection((data) => {
      if (data.status) {
        toast.dismiss(id);
        if (data.status === 'success') {
          toast.success(data.message || 'Prova verificada com sucesso!');
          if (data.result) {
            console.log("[INFO] Resultado da verificação:", data.result);
          }
        } else if (data.status === 'error') {
          toast.error(data.message || 'Erro ao verificar a prova');
        } else if (data.message) {
          toast.loading(data.message);
        }
      }
    });

    // Enviar prova para o backend para conversão e verificação
    id = toast.loading("Enviando prova para verificação...");
    console.log("[INFO] Enviando prova para verificação...");
    
    try {
      const payload = {
        proof: Array.from(new Uint8Array(proof)),
        publicInputs: publicInputs[0],
        vk: Array.from(new Uint8Array(vk)),
      };
      console.log("[DEBUG] Payload:", payload);
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar prova para verificação');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      toast.dismiss(id);
      toast.error("Erro ao enviar prova para verificação");
      console.error("[ERRO] Erro ao enviar prova para verificação:", error);
      return null;
    }
  } catch (err: any) {
    toast.dismiss();
    toast.error("Erro ao enviar prova: " + (err?.message || err));
    console.error("[ERRO] Exceção capturada em generateProof:", err);
    return;
  }
};
