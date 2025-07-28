'use client';

import React, { useRef, useState } from "react";
import { BrowserQRCodeReader } from '@zxing/browser';

export function VerifyProofCard({ onSuccess, walletAddress }: { onSuccess: (data: { wallet: string; date: string }) => void, walletAddress: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMsg, setCameraMsg] = useState("Camera loading...");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulação de câmera e QR code (igual ao HTML original)
  const handleStartCamera = async () => {
    setCameraActive(true);
    setCameraMsg("Camera loading...");
    setError(null);
    setTimeout(() => {
      setCameraMsg("Camera active - Point at QR code");
      setTimeout(() => {
        setCameraMsg("QR Code detected! Verifying...");
        setLoading(true);
        setTimeout(() => {
          const currentDate = new Date().toISOString().split("T")[0];
          onSuccess({ wallet: walletAddress, date: currentDate });
          setLoading(false);
        }, 2000);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="card bg-neutral-900 border border-neutral-800 rounded-md p-6 flex flex-col gap-4">
      <div className="card-title text-base font-medium mb-1">Verify Age Proof</div>
      <div className="card-description text-sm text-neutral-400 mb-2">
        Point camera at QR code to verify a zero-knowledge age proof.
      </div>
      <button
        className={`btn w-full rounded-md py-4 font-mono font-semibold text-sm uppercase tracking-wider transition-all duration-150 ${cameraActive || loading ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-white text-black hover:bg-neutral-200 shadow-md'}`}
        onClick={handleStartCamera}
        disabled={cameraActive || loading}
      >
        START CAMERA
      </button>
      <div className={`camera-container relative w-full flex flex-col items-center gap-2 ${cameraActive ? '' : 'hidden'}`}>
        <div className="camera-view flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded w-full h-52 relative">
          {/* Simulação de vídeo */}
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">{cameraMsg}</div>
          <div className="camera-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border-2 border-white rounded-lg pointer-events-none" />
        </div>
        <div className="camera-instructions text-xs text-neutral-400 mt-2 font-mono">Position QR code within the frame to verify proof</div>
        {loading && <div className="text-xs text-blue-400 animate-pulse font-mono">Verifying on zkVerify...</div>}
        {error && <div className="text-xs text-red-400 mt-2 font-mono">{error}</div>}
      </div>
    </div>
  );
} 