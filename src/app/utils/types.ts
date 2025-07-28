export enum MessageTypeSSE {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export type MessageSSE = {
  type: MessageTypeSSE;
  message: string;
  id?: number;
}; 