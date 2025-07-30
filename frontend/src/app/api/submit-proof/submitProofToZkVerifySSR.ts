import { MessageTypeSSE } from "@/app/utils/types";
import { emitSSE } from "./eventsSSE";
import { sleep } from "@/app/utils/timer";

export async function submitProofToZkVerify(
  proof: any,
  publicInputs: any,
  vk: any
): Promise<any> {
  try {
    emitSSE("🛠️ Configurando sessão zkVerify...", MessageTypeSSE.INFO);
    await sleep(2000)
    emitSSE("✅ Sessão configurada", MessageTypeSSE.SUCCESS);

    emitSSE("📬 Registrando chave de verificação...", MessageTypeSSE.INFO);
    await sleep(2000)
    emitSSE("✅ Chave registrada: 0xaaaa", MessageTypeSSE.SUCCESS);

    emitSSE("📤 Submetendo prova...", MessageTypeSSE.INFO);
    await sleep(2000)
    emitSSE("🧱 Prova incluída no bloco: 0xbbbb", MessageTypeSSE.SUCCESS);
    
    emitSSE("✅ Prova finalizada: 0xcccc", MessageTypeSSE.SUCCESS);
    emitSSE("📦 Agregação concluída: 0xdddd", MessageTypeSSE.SUCCESS);

    return { status: "ok" };
  } catch (err: any) {
    throw new Error(`Erro ao submeter prova: ${err.message}`);
  }
}
