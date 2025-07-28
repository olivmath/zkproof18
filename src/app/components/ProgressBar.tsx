import React from "react";

export function ProgressBar({ progress, stepText, isVisible }: { progress: number; stepText: string; isVisible: boolean }) {
  if (!isVisible) return null;
  return (
    <div className="progress-container my-5">
      <div className="progress-bar w-full h-0.5 bg-neutral-800 rounded overflow-hidden">
        <div className="progress-fill h-full bg-white transition-all duration-500" style={{ width: progress + '%' }} />
      </div>
      <div className="progress-text text-xs text-neutral-400 mt-2 text-center font-mono">{stepText || 'Generating proof...'}</div>
    </div>
  );
} 