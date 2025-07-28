"use client";
import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  isVisible: boolean;
}

export function ProgressBar({ currentStep, totalSteps, currentStepName, isVisible }: ProgressBarProps) {
  if (!isVisible) return null;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-background/50 border border-foreground/10 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-foreground/70">Etapa {currentStep} de {totalSteps}</span>
        <span className="text-sm font-medium text-foreground/90">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-foreground/10 rounded-full h-3 mb-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      <p className="text-center text-sm font-medium text-foreground/90">{currentStepName}</p>
      <div className="flex justify-center mt-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
} 