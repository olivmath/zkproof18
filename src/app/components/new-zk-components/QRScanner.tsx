"use client";

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onQRCodeDetected: (data: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export const QRScanner = ({ onQRCodeDetected, onError, className = '' }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState('Ready to scan');

  useEffect(() => {
    // jsQR is now imported directly, no need to load dynamically
    setStatus('Ready to scan');
  }, []);

  const startScanning = async () => {
    try {
      setStatus('Requesting camera access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        setIsScanning(true);
        setStatus('Scanning for QR codes...');
        
        // Start scanning
        startQRScanning();
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      onError('Failed to access camera. Please check permissions.');
    }
  };

  const startQRScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        scanFrame();
      }
    }, 100); // Scan every 100ms for better responsiveness
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use jsQR library to detect QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      console.log('QR Code detected:', code.data);
      handleQRCodeDetected(code.data);
    }
  };



  const handleQRCodeDetected = (data: string) => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    setStatus('QR Code detected! Validating...');
    
    // Validate QR code content
    const isValidProof = validateProofQRCode(data);
    
    if (isValidProof) {
      setStatus('Proof validated! Processing...');
      // Stop camera
      stopScanning();
      // Call the callback
      onQRCodeDetected(data);
    } else {
      setStatus('Invalid proof QR code. Try again.');
      // Continue scanning for valid QR codes
      setTimeout(() => {
        if (isScanning) {
          setStatus('Scanning for QR codes...');
        }
      }, 2000);
    }
  };

  const validateProofQRCode = (data: string): boolean => {
    try {
      // Check if it's a valid proof URL (like the one you provided)
      if (data.startsWith('https://zkverify.io/proof/')) {
        const proofHash = data.split('/').pop();
        // Validate proof hash format (should be a hex string starting with 0x)
        if (proofHash && /^0x[0-9a-fA-F]+$/.test(proofHash)) {
          return true;
        }
      }
      
      // Check if it's a valid proof data structure
      if (data.startsWith('zkproof://')) {
        return true;
      }
      
      // Check if it contains valid JSON proof data
      try {
        const proofData = JSON.parse(data);
        if (proofData.proofHash || proofData.nullifier) {
          return true;
        }
      } catch {
        // Not JSON, continue checking
      }
      
      return false;
    } catch (error) {
      console.error('Error validating QR code:', error);
      return false;
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setIsScanning(false);
    setStatus('Scanner stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Camera viewport */}
      <div className="relative w-full h-48 bg-gray-900 border border-gray-700 rounded overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        
        {/* Scanning overlay with improved design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main scanning frame */}
            <div className="w-40 h-40 border-2 border-white rounded-lg relative">
              {/* Corner indicators */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
              
              {/* Animated scanning line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-400 animate-pulse"></div>
            </div>
            
            {/* Scanning animation */}
            <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-ping opacity-20"></div>
          </div>
        </div>
        
        {/* Status indicator - moved to top to avoid overlap */}
        <div className="absolute top-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded text-center">
          {status}
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Control buttons - moved outside camera viewport */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={isScanning ? stopScanning : startScanning}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          {isScanning ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
      
      {/* Instructions */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Position QR code within the frame to verify proof
      </div>
    </div>
  );
}; 