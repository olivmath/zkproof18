import { MessageTypeSSE } from "@/app/utils/types";

export function emitSSE(message: string, type: MessageTypeSSE){
  console.log(message);
  global.sendSSEMessage(JSON.stringify({ message, type}));
}
