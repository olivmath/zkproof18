'use client';

import React, { useRef, useState } from "react";
import { BrowserQRCodeReader } from '@zxing/browser';

export function VerifyProofCard({ onSuccess, walletAddress }: { onSuccess: (data: { wallet: string; date: string }) => void, walletAddress: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMsg, setCameraMsg] = useState("Camera loading...");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartCamera = async () => {
    setCameraActive(true);
    setCameraMsg("Camera loading...");
    setError(null);
    setTimeout(async () => {
      setCameraMsg("Camera active - Point at QR code");
      try {
        const codeReader = new BrowserQRCodeReader();
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current!);
        setCameraMsg("QR Code detected! Verifying...");
        setLoading(true);
        setTimeout(async () => {
          let proofUrl = result.getText();
          let txHash = '';
          const match = proofUrl.match(/extrinsic\/(\w+)/);
          if (match) txHash = match[1];
          else txHash = proofUrl;
          try {
            const resp = await fetch(`https://zkverify-testnet.subscan.io/api/scan/extrinsic`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hash: txHash })
            });
            const data = await resp.json();
            if (data.code === 0) {
              const currentDate = new Date().toISOString().split("T")[0];
              onSuccess({ wallet: walletAddress, date: currentDate });
            } else {
              setError("Proof not found or invalid on zkVerify.");
              setCameraMsg("Proof not found or invalid.");
            }
          } catch (e) {
            setError("Error connecting to zkVerify.");
            setCameraMsg("Error connecting to zkVerify.");
          }
          setLoading(false);
        }, 1000);
      } catch (e) {
        setError("QR Code not detected or camera error.");
        setCameraMsg("QR Code not detected or camera error.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-[#111] border border-[#333] rounded-lg p-6 shadow-lg flex flex-col gap-4">
      <div className="text-lg font-semibold mb-1">Verify Age Proof</div>
      <div className="text-sm text-gray-400 mb-2">
        Point camera at QR code to verify a zero-knowledge age proof.
      </div>
      <button
        className={`w-full rounded-md py-3 font-mono font-semibold text-sm uppercase tracking-wider transition-all duration-150 ${cameraActive || loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-white to-gray-300 text-black hover:from-gray-200 hover:to-white shadow-md'}`}
        onClick={handleStartCamera}
        disabled={cameraActive || loading}
      >
        START CAMERA
      </button>
      <div className={`relative w-full flex flex-col items-center gap-2 ${cameraActive ? '' : 'hidden'}`}>
        <div className="camera-view flex items-center justify-center bg-gray-900 border border-gray-700 rounded w-full h-52 relative">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border-2 border-white rounded-lg pointer-events-none animate-pulse" />
        </div>
        <div className="text-xs text-gray-400 mt-2 font-mono">Position QR code within the frame to verify proof</div>
        <div className="text-xs text-gray-400 mt-1 font-mono">{cameraMsg}</div>
        {loading && <div className="text-xs text-blue-400 animate-pulse font-mono">Verifying on zkVerify...</div>}
        {error && <div className="text-xs text-red-400 mt-2 font-mono">{error}</div>}
      </div>
    </div>
  );
} 