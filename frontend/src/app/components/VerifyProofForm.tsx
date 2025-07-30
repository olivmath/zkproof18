"use client";

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { QRScanner } from './QRScanner';

interface VerifyProofFormProps {
  onProofVerified: (verificationData: any) => void;
}

export const VerifyProofForm = ({ onProofVerified }: VerifyProofFormProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  const handleQRCodeDetected = (qrData: string) => {
    console.log('QR Code detected:', qrData);
    
    // Parse the QR data to extract proof information
    const proofHash = qrData.split('/').pop() || 'unknown';
    
    // Simulate verification process
    setTimeout(() => {
      const verificationData = {
        nullifier: '0x' + Array.from({length: 8}, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...efgh',
        verifiedDate: new Date().toISOString().split('T')[0],
        status: '18+ CONFIRMED',
        proofHash: proofHash,
        qrData: qrData
      };
      
      onProofVerified(verificationData);
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const startScanning = () => {
    setIsScanning(true);
    setError('');
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <Card>
      <div className="text-base font-medium mb-3">Verify Age Proof</div>
      <div className="text-sm text-gray-400 leading-relaxed mb-5">
        Point camera at QR code to verify a zero-knowledge age proof.
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-5">
        <QRScanner 
          onQRCodeDetected={handleQRCodeDetected}
          onError={handleError}
          className="w-full"
        />
      </div>
    </Card>
  );
}; 