'use client';

import React, { useState } from "react";

export function VerifyProofCard({ onSuccess, walletAddress }: { onSuccess: (data: { wallet: string; date: string }) => void, walletAddress: string }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMsg, setCameraMsg] = useState("Camera loading...");

  const handleStartCamera = () => {
    setCameraActive(true);
    setCameraMsg("Camera loading...");
    setTimeout(() => {
      setCameraMsg("Camera active - Point at QR code");
      setTimeout(() => {
        setCameraMsg("QR Code detected! Verifying...");
        setTimeout(() => {
          const currentDate = new Date().toISOString().split("T")[0];
          onSuccess({ wallet: walletAddress, date: currentDate });
        }, 2000);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="card">
      <div className="card-title">Verify Age Proof</div>
      <div className="card-description">
        Point camera at QR code to verify a zero-knowledge age proof.
      </div>
      <button className="btn" onClick={handleStartCamera} disabled={cameraActive}>START CAMERA</button>
      <div className={`camera-container${cameraActive ? '' : ' hidden'}`}>
        <div className="camera-view">
          <div>{cameraMsg}</div>
        </div>
        <div className="camera-overlay"></div>
        <div className="camera-instructions">Position QR code within the frame to verify proof</div>
      </div>
    </div>
  );
} 