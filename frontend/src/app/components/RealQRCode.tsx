"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface RealQRCodeProps {
  text: string;
  size?: number;
  className?: string;
}

export const RealQRCode = ({ text, size = 200, className = '' }: RealQRCodeProps) => {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const generateQRCode = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use QR Server API to generate real QR code
      const encodedText = encodeURIComponent(text);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png&margin=2&color=000000&bgcolor=FFFFFF`;
      
      setQrImageUrl(qrUrl);
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
      setIsLoading(false);
    }
  }, [text, size]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  if (isLoading) {
    return (
      <div 
        className={`bg-white flex items-center justify-center ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className="text-gray-500 text-sm">Generating QR...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`bg-white flex items-center justify-center border border-red-200 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className="text-red-500 text-xs text-center px-2">
          QR Code Error<br/>
          <span className="text-gray-400">{text.substring(0, 20)}...</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={qrImageUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={className}
    />
  );
};