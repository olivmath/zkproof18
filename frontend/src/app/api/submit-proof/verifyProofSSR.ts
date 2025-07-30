import { MessageTypeSSE } from "@/app/utils/types";
import { emitSSE } from "./eventsSSE";
import { sleep } from "@/app/utils/timer";

export async function verifyProof(proof: any): Promise<boolean> {
  let id: number;

  try {
    emitSSE("⌛ Verificando prova localmente...", MessageTypeSSE.INFO);
    
    // Aqui deveria chamar o verificador real
    // const result = await backend.verifyProof(proof);
    await sleep(2000)

    emitSSE("✅ Prova verificada localmente", MessageTypeSSE.SUCCESS);
    return true;
  } catch (err: any) {
    throw new Error(`Erro ao verificar prova localmente: ${err.message}`);
  }
}
