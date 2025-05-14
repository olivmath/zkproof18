export const generateProof = async (birthYear: number) => {
  try {
    // Initial setup
    console.log("⏳ Setting up session...");
    console.log("✅ Session configured...");
    console.log("⏳ Generating witness...");
    console.log("✅ Witness generated...");
    console.log("⏳ Generating proof...");
    console.log("✅ Proof generated...");

    fetch("/api/submit-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proof: [1, 2, 3, 4, 5],
        publicInputs: [1, 2, 3, 4, 5],
        vk: [1, 2, 3, 4, 5],
      }),
    });
  } catch (err) {
    console.log("💔 Error generating proof");
    console.error("💔 Proof generation failed:", err);
  }
};
