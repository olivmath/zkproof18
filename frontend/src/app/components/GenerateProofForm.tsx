"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { toast } from "sonner";
import { generateProof } from "../services/generateProof";

interface GenerateProofFormProps {
  onProofGenerated: (proofData: any) => void;
}

export const GenerateProofForm = ({
  onProofGenerated,
}: GenerateProofFormProps) => {
  const [birthDate, setBirthDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const handleGenerateProof = async () => {
    if (!birthDate) {
      toast.error("Please select your birth date.");
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();

    if (age < 18) {
      toast.error("You must be at least 18 years old.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressText("Setting up session...");

    try {
      const birthYear = birth.getFullYear();

      const progressUpdates = [
        { progress: 20, text: "Deriving wallet secret..." },
        { progress: 40, text: "Generating nullifier..." },
        { progress: 60, text: "Computing ZK proof..." },
        { progress: 80, text: "Verifying on ZKVerify..." },
        { progress: 100, text: "Proof generated successfully!" },
      ];

      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < progressUpdates.length) {
          const update = progressUpdates[currentStep];
          setProgress(update.progress);
          setProgressText(update.text);
          currentStep++;
        }
      }, 1000);

      await generateProof(birthYear);

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Proof generated successfully!");

      const proofData = {
        nullifier:
          "0x" +
          Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("") +
          "...abcd",
        proofHash:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(""),
        verifiedDate: new Date().toISOString().split("T")[0],
        walletAddress: "UQB...7x2f",
        birthYear,
      };

      setTimeout(() => {
        setIsGenerating(false);
        onProofGenerated(proofData);
      }, 1000);
    } catch (error: any) {
      setIsGenerating(false);
      toast.error("Error generating proof: " + error.message);
    }
  };

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <Card>
      <div className="text-base font-medium mb-3">Generate Age Proof</div>
      <div className="text-sm text-gray-400 leading-relaxed mb-5">
        Prove you're 18+ without revealing your actual age or birth date.
      </div>

      <div className="mb-5">
        <label
          htmlFor="birthDate"
          className="block text-xs text-white mb-2 uppercase tracking-wider"
        >
          Birth Date
        </label>

        {/* Input do tipo date já ativa um calendário na maioria dos navegadores */}
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={eighteenYearsAgo.toISOString().split("T")[0]}
        />
      </div>

      <Button onClick={handleGenerateProof} disabled={isGenerating}>
        {isGenerating ? "GENERATING..." : "GENERATE ZK PROOF"}
      </Button>

      {isGenerating && (
        <div className="mt-5">
          <div className="w-full h-0.5 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {progressText}
          </div>
        </div>
      )}
    </Card>
  );
};
