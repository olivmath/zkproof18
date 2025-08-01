"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { generateProof } from "../services/generateProof";
import { serverLog } from "../utils/serverLogger";

interface GenerateProofFormProps {
  onProofGenerated: (proofData: any) => void;
}

export const GenerateProofForm = ({
  onProofGenerated,
}: GenerateProofFormProps) => {
  const wallet = useTonWallet();
  const [birthDate, setBirthDate] = useState("1997-04-30");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

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

    const controller = new AbortController();
    setAbortController(controller);
    setIsGenerating(true);
    setProgress(0);
    setProgressText("Setting up session...");
    setError("");

    try {
      const birthYear = birth.getFullYear();

      // Callback para atualizar progresso em tempo real
      const handleProgress = (progress: number, text: string) => {
        setProgress(progress);
        setProgressText(text);
      };

      const handleCancelGeneration = () => {
        if (abortController) {
          abortController.abort();
          setIsGenerating(false);
          setProgress(0);
          setProgressText("");
          setAbortController(null);
        }
      };
      const result = await generateProof(birthYear, handleProgress);

      // Finalizar progresso
      setProgress(95);
      setProgressText("Processing response...");

      // Só avança quando tiver resposta do backend
      setProgress(90);
      setProgressText("Processing response...");

      // Usar dados reais do backend
      const proofData = {
        txHash: result.txHash,
        verified: result.verified,
        message: result.message,
        verifiedDate: new Date().toISOString().split("T")[0],
        birthYear,
      };

      // Salvar no localStorage
      if (wallet?.account?.address && result.txHash) {
        try {
          const walletAddress = Address.parse(wallet.account.address).toString({
            urlSafe: true,
            bounceable: false,
          });
          localStorage.setItem(walletAddress, result.txHash);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      }

      // Só completa quando tudo estiver pronto
      setProgress(100);
      setProgressText("Proof generated successfully!");

      setTimeout(() => {
        setIsGenerating(false);
        onProofGenerated(proofData);
      }, 500);
    } catch (error: any) {
      if (error.name === "AbortError") {
        setProgressText("Generation cancelled");
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
    setProgress(0);
    setProgressText("");
    setError("");
  };

  // Calculate max date (18 years ago) and min date (100 years ago)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <Card>
      <div className="text-base font-medium mb-3">Generate Age Proof</div>
      <div className="text-sm text-gray-400 leading-relaxed mb-5">
        Select your birth date to generate a zero-knowledge age proof. You must
        be between 18 and 100 years old to proceed.
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

      <Button
        onClick={handleGenerateProof}
        disabled={isGenerating || !birthDate}
      >
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
      {isGenerating && (
        <div className="flex justify-center">
          <button
            onClick={handleCancelGeneration}
            className="mt-3 w-[95%] bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded transition-colors duration-200 font-mono uppercase tracking-wider"
          >
            CANCEL
          </button>
        </div>
      )}

      {error && (
        <div className="mt-5 p-3 bg-red-900/20 border border-red-700 rounded">
          <div className="text-red-400 text-sm font-mono">Error: {error}</div>
        </div>
      )}
    </Card>
  );
};
