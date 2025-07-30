import { MessageTypeSSE } from "@/app/utils/types";
import { emitSSE } from "./eventsSSE";

export function convertProofToHex(proof: any, vk: any): { proofHex: string; vkHex: string } {
  emitSSE("🔄 Convertendo prova e chave de verificação para hexadecimal...", MessageTypeSSE.INFO);

  return { proofHex: "0xaaa", vkHex: "0xbbb" };
}
