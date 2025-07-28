"use client";
import React, { useState } from "react";
import { generateProof, ProofProgress, ProofResult } from "../services/generateProof";
import { ProgressBar } from "./ProgressBar";
import { TransactionResult } from "./TransactionResult";

export function BirthdayForm() {
  const [birthdate, setBirthdate] = useState("1997-04-30");
  const [isClicked, setIsClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProofProgress | null>(null);
  const [result, setResult] = useState<ProofResult | null>(null);

  const handleClick = async () => {
    setIsClicked(true);
    setIsProcessing(true);
    setProgress(null);
    setResult(null);
    
    const year = new Date(birthdate).getFullYear();
    
    const proofResult = await generateProof(year, (progressData) => {
      setProgress(progressData);
    });
    
    setResult(proofResult);
    setIsProcessing(false);
    
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div className="text-center">
      <h1 className="mb-8 font-mono text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl md:text-7xl">
        <span>🎉 Birthdate</span>
        <br />
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Proof!</span>
      </h1>

      <div className="flex flex-col items-center gap-4">
        <label htmlFor="birthdate" className="text-foreground/80 mb-0.5 block">
          Input your birthdate
        </label>
        <input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
          disabled={isProcessing}
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={isProcessing}
          className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-all duration-150 ${
            isClicked ? "scale-95" : "scale-100"
          } ${
            isProcessing 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:opacity-90 hover:scale-105"
          }`}
        >
          {isProcessing ? "Processando..." : "Generate Proof"}
        </button>
      </div>

      {/* Barra de Progresso */}
      <ProgressBar
        currentStep={progress?.currentStep || 0}
        totalSteps={progress?.totalSteps || 8}
        currentStepName={progress?.stepName || ""}
        isVisible={isProcessing}
      />

      {/* Resultado da Transação */}
      {result && result.success && result.txHash && (
        <TransactionResult
          txHash={result.txHash}
          isVisible={true}
        />
      )}

      {/* Erro */}
      {result && !result.success && (
        <div className="w-full max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg mt-6">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Erro ao Processar
            </h3>
            <p className="text-sm text-red-700">
              {result.error || "Ocorreu um erro inesperado"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
