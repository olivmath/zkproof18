import { NextResponse, NextRequest } from "next/server";
import { submitProofToZkVerify } from "./sendToZkVerifySSR";
import { verifyProof } from "./verifyProofSSR";

export async function POST(req: NextRequest) {
  try {
    console.log("✅ Received request to submit proof");
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { proof, publicInputs, vk } = body;

    console.log("body:", body);

    if (!proof || !publicInputs || !vk) {
      return NextResponse.json(
        {
          error: "Missing required fields: proofHex, publicInputs, vkHex",
        },
        { status: 400 }
      );
    }

    console.log("⌛ Verifying proof locally...");
    const result = verifyProof(proof, publicInputs);
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
