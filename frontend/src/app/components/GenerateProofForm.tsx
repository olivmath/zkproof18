"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

import { generateProof } from "../services/generateProof";

interface GenerateProofFormProps {
  onProofGenerated: (proofData: any) => void;
}

export const GenerateProofForm = ({
  onProofGenerated,
}: GenerateProofFormProps) => {
  const [birthDate, setBirthDate] = useState("1997-04-30");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const handleGenerateProof = async () => {
    if (!birthDate) {
      setError("Please select your birth date.");
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();

    if (age < 18) {
      setError("You must be at least 18 years old to generate a proof.");
      return;
    }

    if (age > 100) {
      setError("Age must be 100 years or less to generate a proof.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressText("Setting up session...");
    setError("");

    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      const birthYear = birth.getFullYear();

      const progressUpdates = [
        { progress: 12, text: "Loading circuit..." },
        { progress: 25, text: "Generating witness..." },
        { progress: 37, text: "Generating cryptographic proof..." },
        { progress: 50, text: "Generating verification key..." },
        { progress: 62, text: "Verifying proof locally..." },
        { progress: 75, text: "Submitting to blockchain..." },
        { progress: 87, text: "Finalizing transaction..." },
        { progress: 100, text: "Proof generated successfully!" },
      ];

      let currentStep = 0;
      progressInterval = setInterval(() => {
        if (currentStep < progressUpdates.length) {
          const update = progressUpdates[currentStep];
          setProgress(update.progress);
          setProgressText(update.text);
          currentStep++;
        }
      }, 1000);

      const result = await generateProof(birthYear);

      if (progressInterval) clearInterval(progressInterval);
      
      setProgress(100);
      setProgressText("Proof generated successfully!");

      const proofData = {
        nullifier: "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...abcd",
        proofHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        verifiedDate: new Date().toISOString().split("T")[0],
        walletAddress: "UQB...7x2f",
        birthYear,
      };

      setTimeout(() => {
        setIsGenerating(false);
        onProofGenerated(proofData);
      }, 1000);
    } catch (error: any) {
      if (progressInterval) clearInterval(progressInterval);
      setIsGenerating(false);
      setError(error.message || "An unexpected error occurred");
    }
  };

  // Calculate max date (18 years ago) and min date (100 years ago)
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString().split('T')[0];
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    .toISOString().split('T')[0];

  return (
    <Card>
      <div className="text-base font-medium mb-3">Generate Age Proof</div>
      <div className="text-sm text-gray-400 leading-relaxed mb-5">
        Select your birth date to generate a zero-knowledge age proof. You must be between 18 and 100 years old to proceed.
      </div>

      <div className="mb-5">
        <label
          htmlFor="birthDate"
          className="block text-xs text-white mb-2 uppercase tracking-wider"
        >
          Birth Date
        </label>

        <input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          min={minDate}
          max={maxDate}
          className="w-full p-3 bg-black border border-gray-700 rounded text-white font-mono text-sm hover:border-gray-500 focus:border-gray-500 focus:outline-none transition-colors
            [&::-webkit-calendar-picker-indicator]:invert
            [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
        />
      </div>

      <Button onClick={handleGenerateProof} disabled={isGenerating || !birthDate}>
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

      {error && (
        <div className="mt-5 p-3 bg-red-900/20 border border-red-700 rounded">
          <div className="text-red-400 text-sm font-mono">
            Error: {error}
          </div>
        </div>
      )}
    </Card>
  );
};