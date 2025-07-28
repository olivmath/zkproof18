'use client';

import React, { useState } from "react";
import { generateProof, ProofProgress } from "../services/generateProof";
import { ProgressBar } from "./ProgressBar";

export function GenerateProofCard({ onSuccess, walletAddress }: { onSuccess: (data: { wallet: string; date: string; proofUrl: string; txHash: string }) => void, walletAddress: string }) {
  const [birthDate, setBirthDate] = useState("1997-04-30");
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set max date to 18 years ago
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDate = eighteenYearsAgo.toISOString().split("T")[0];

  const handleGenerate = async () => {
    setError(null);
    if (!birthDate) {
      setError("Please enter your birth date");
      return;
    }
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    if (age < 18) {
      setError("You must be at least 18 years old");
      return;
    }
    setIsGenerating(true);
    setProgress(0);
    setStepText("");
    const year = birth.getFullYear();
    const result = await generateProof(year, (p: ProofProgress) => {
      setProgress((p.currentStep / p.totalSteps) * 100);
      setStepText(p.stepName);
    });
    setIsGenerating(false);
    if (result && result.success && result.txHash) {
      const proofUrl = `https://zkverify-testnet.subscan.io/extrinsic/${result.txHash}`;
      const currentDate = new Date().toISOString().split("T")[0];
      onSuccess({
        wallet: walletAddress,
        date: currentDate,
        proofUrl,
        txHash: result.txHash,
      });
    } else {
      setError(result?.error || "Failed to generate proof");
    }
  };

  return (
    <div className="bg-[#111] border border-[#333] rounded-lg p-6 shadow-lg transition-all duration-200 hover:border-white hover:shadow-xl flex flex-col gap-4">
      <div className="text-lg font-semibold mb-1">Generate Age Proof</div>
      <div className="text-sm text-gray-400 mb-2">
        Prove you're 18+ without revealing your actual age or birth date.
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-xs text-white uppercase tracking-wider mb-1" htmlFor="birthDate">Birth Date</label>
        <input
          type="date"
          id="birthDate"
          className="w-full bg-black border border-[#333] rounded-md px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-all"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          max={maxDate}
          disabled={isGenerating}
        />
      </div>
      <button
        className={`w-full rounded-md py-3 font-mono font-semibold text-sm uppercase tracking-wider transition-all duration-150 ${isGenerating ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-white to-gray-300 text-black hover:from-gray-200 hover:to-white shadow-md'}`}
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? "GENERATING..." : "Generate ZK Proof"}
      </button>
      <ProgressBar progress={progress} stepText={stepText} isVisible={isGenerating} />
      {error && <div className="text-xs text-red-400 mt-2 text-center font-mono">{error}</div>}
    </div>
  );
} 