'use client';

import React, { useState } from "react";
import { generateProof, ProofProgress } from "../services/generateProof";
import { ProgressBar } from "./ProgressBar";

export function GenerateProofCard({ onSuccess, walletAddress }: { onSuccess: (data: { wallet: string; nullifier: string; date: string; proofUrl: string; txHash: string }) => void, walletAddress: string }) {
  const [birthDate, setBirthDate] = useState("1997-04-30");
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Set max date to 18 years ago
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDate = eighteenYearsAgo.toISOString().split("T")[0];

  const handleGenerate = async () => {
    if (!birthDate) {
      alert("Please enter your birth date");
      return;
    }
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    if (age < 18) {
      alert("You must be at least 18 years old");
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
      const mockNullifier = "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...abcd";
      const proofUrl = `https://zkverify-testnet.subscan.io/extrinsic/${result.txHash}`;
      const currentDate = new Date().toISOString().split("T")[0];
      onSuccess({
        wallet: walletAddress,
        nullifier: mockNullifier,
        date: currentDate,
        proofUrl,
        txHash: result.txHash,
      });
    }
  };

  return (
    <div className="card">
      <div className="card-title">Generate Age Proof</div>
      <div className="card-description">
        Prove you're 18+ without revealing your actual age or birth date.
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="birthDate">Birth Date</label>
        <input type="date" id="birthDate" className="input-field" value={birthDate} onChange={e => setBirthDate(e.target.value)} max={maxDate} />
      </div>
      <button className="btn" onClick={handleGenerate} disabled={isGenerating}>{isGenerating ? "GENERATING..." : "Generate ZK Proof"}</button>
      <ProgressBar progress={progress} stepText={stepText} isVisible={isGenerating} />
    </div>
  );
} 