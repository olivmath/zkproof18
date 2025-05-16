import { NextResponse, NextRequest } from "next/server";
import { submitProofToZkVerify } from "./submitProofToZkVerifySSR";
import { verifyProof } from "./verifyProofSSR";
import { emitSSE } from "./eventsSSE";
import { convertProofToHex } from "./convertProof";
import { MessageTypeSSE } from "@/app/utils/types";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      global.sendSSEMessage = (message: string) => {
        controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  const { UltraPlonkBackend } = await import("@aztec/bb.js");
  const circuit = await import("../../../../public/circuit.json");

  const backend = new UltraPlonkBackend(circuit.bytecode);

  let id: number | undefined;

  try {
    emitSSE(
      "📩 Recebi a requisição para submeter prova...",
      MessageTypeSSE.SUCCESS
    );

    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

  
    const { proof, publicInputs, vk } = body;

    // convert proof to uint8array
    const proofUint8Array = new Uint8Array(Object.values(proof));
    // convert vk to uint8array
    const vkUint8Array = new Uint8Array(Object.values(vk))

    console.log("proofArray", proofUint8Array);
    console.log("vkArray", vkUint8Array);
    console.log("publicInputs", publicInputs);

    if (!proof || !publicInputs || !vk) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: proof, publicInputs, vk" },
        { status: 400 }
      );
    }

    const result = await verifyProof(proof);

    if (!result) {
      return NextResponse.json(
        { error: "Falha na verificação da prova" },
        { status: 400 }
      );
    }

    const { proofHex, vkHex } = convertProofToHex(proof, vk);
    const response = await submitProofToZkVerify(proofHex, publicInputs, vkHex);

    return NextResponse.json(
      { message: "Prova enviada com sucesso", response },
      { status: 200 }
    );
  } catch (err: any) {
    emitSSE(`❌ Erro ao submeter prova: ${err.message}`, MessageTypeSSE.ERROR);
    return NextResponse.json(
      { error: "Falha ao submeter prova", details: err.message },
      { status: 500 }
    );
  }
}
