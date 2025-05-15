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
  //
  // >>>>> TODO: FIX BUG HERE IN IMPORT ULTRA PLONK BACKEND FROM AZTEC.JS WASM <<<<<<
  //
  // ⨯ Error: ENOENT: no such file or directory, open '[project]/node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/fetch_code/node/index.js [app-route] (ecmascript)/../../barretenberg-threads.wasm.gz'
  //   at async fetchCode (../../../../../src/barretenberg_wasm/fetch_code/node/index.ts:19:25)
  //   at async fetchModuleAndThreads (../../../src/barretenberg_wasm/index.ts:17:15)
  //   at async BarretenbergSync.new (../../../src/barretenberg/index.ts:102:32)
  //   at async eval (../../../src/barretenberg/index.ts:156:0) {
  // errno: -2,
  // code: 'ENOENT',
  // syscall: 'open',
  // path: '[project]/node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/fetch_code/node/index.js [app-route] (ecmascript)/../../barretenberg-threads.wasm.gz'
  // }
  //
  // ⨯ Error: ENOENT: no such file or directory, open '[project]/node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/fetch_code/node/index.js [app-route] (ecmascript)/../../barretenberg-threads.wasm.gz'
  //   at async fetchCode (../../../../../src/barretenberg_wasm/fetch_code/node/index.ts:19:25)
  //   at async fetchModuleAndThreads (../../../src/barretenberg_wasm/index.ts:17:15)
  //   at async BarretenbergSync.new (../../../src/barretenberg/index.ts:102:32)
  //   at async eval (../../../src/barretenberg/index.ts:156:0) {
  // errno: -2,
  // code: 'ENOENT',
  // syscall: 'open',
  // path: '[project]/node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/fetch_code/node/index.js [app-route] (ecmascript)/../../barretenberg-threads.wasm.gz'
  // }
  //
  // POST /api/submit-proof 500 in 219ms
  //
  // const { UltraPlonkBackend } = await import("@aztec/bb.js");
  // const circuit = await import("../../../../public/circuit.json");
  // const backend = new UltraPlonkBackend(circuit.bytecode);

  let id: number | undefined;

  try {
    emitSSE(
      "📩 Recebi a requisição para submeter prova...",
      MessageTypeSSE.SUCCESS
    );

    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { proof, publicInputs, vk } = body;

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
