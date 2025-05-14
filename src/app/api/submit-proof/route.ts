import { NextResponse, NextRequest } from "next/server";
import { submitProofToZkVerify } from "./sendToZkVerifySSR";
import { verifyProof } from "./verifyProofSSR";


export async function POST(req: NextRequest) {;
  console.log("⏳ Setting up UltraPlonk session...");
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
  const { UltraPlonkBackend } = await import("@aztec/bb.js");
  const circuit = await import("../../../../public/circuit.json");
  const backend = new UltraPlonkBackend(circuit.bytecode);

  try {
    console.log("✅ Received request to submit proof");
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { proof, publicInputs, vk } = body;

    const proofUint8 = Uint8Array.from(Object.values(proof));
    const vkUint8 = Uint8Array.from(Object.values(vk));


    if (!proof || !publicInputs || !vk) {
      return NextResponse.json(
        {
          error: "Missing required fields: proofHex, publicInputs, vkHex",
        },
        { status: 400 }
      );
    }

    console.log("⌛ Verifying proof locally...");
    const result = await verifyProof(backend, proof);
    if (!result) {
      return NextResponse.json(
        { error: "Proof verification failed" },
        { status: 400 }
      );
    }
    console.log("✅ Proof verified successfully");

    console.log("⏳ Converting proof to hex...");

    console.log("⏳ Submitting proof to zkVerify...");
    const response = await submitProofToZkVerify(proof, publicInputs, vk);

    return NextResponse.json(
      { message: "Proof submitted successfully", response },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("💔 Error submitting proof:", err);
    return NextResponse.json(
      { error: "Failed to submit proof", details: err.message },
      { status: 500 }
    );
  }
}
