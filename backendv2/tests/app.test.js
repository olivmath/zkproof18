import request from "supertest";
import app from "../src/app.js";
import { generateProof } from "./utils.proof.js";

describe("ZK Proof API Tests", () => {
  // Set timeout to 3 minutes for all tests

  it("should successfully generate and verify proof for birth year 1997", async () => {
    const birthYear = 1997;

    // Generate the ZK proof
    let proofData;
    try {
      proofData = await generateProof(birthYear);
    } catch (err) {
      console.error(err)
      throw new Error("Failed to generate proof");
    }

    // Prepare payload with proof data
    const payload = {
      publicInputs: Array.from(proofData.publicInputs),
      proof: proofData.proof,
      vk: Array.from(proofData.vk),
    };

    const response = await request(app)
      .post("/api/verify")
      .send(payload)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "Proof verified successfully!",
      verified: true,
    });
  }, 180000);

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
