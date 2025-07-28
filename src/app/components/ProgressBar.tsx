import React from "react";

export function ProgressBar({ progress, stepText, isVisible }: { progress: number; stepText: string; isVisible: boolean }) {
  if (!isVisible) return null;
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: progress + "%" }}></div>
      </div>
      <div className="progress-text">{stepText || "Generating proof..."}</div>
    </div>
  );
} 