import request from "supertest";
import app from "../src/app.js";
import { generateProof } from "./utils.proof.js";

describe("ZK Proof API Tests", () => {
  it("should successfully generate and verify proof for birth year 1997", async () => {
    const birthYear = 1997;

    // Generate the ZK proof
    let proofData;
    try {
      proofData = await generateProof(birthYear);
    } catch (err) {
      throw new Error("Failed to generate proof");
    }

    // Prepare payload with proof data
    const payload = {
      publicInputs: proofData.publicInputs,
      proof: proofData.proof,
      vk: proofData.vk,
    };

    const response = await request(app)
      .post("/api/verify")
      .send(payload)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "Proof verified successfully",
      isValid: true,
    });
  });

  it("should return 400 for invalid proof data", async () => {
    const invalidPayload = {
      publicInputs: [],
      proof: [],
    };

    const response = await request(app)
      .post("/api/verify")
      .send(invalidPayload)
      .expect(400);

    expect(response.body).toEqual({
      error: "Invalid proof data",
    });
  });

  it("should return 404 for undefined routes", async () => {
    const response = await request(app)
      .post("/undefined-route")
      .send({})
      .expect(404);

    expect(response.body).toEqual({
      error: "Route not found",
    });
  });
});
