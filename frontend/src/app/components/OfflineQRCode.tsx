"use client";

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface OfflineQRCodeProps {
  text: string;
  size?: number;
  className?: string;
}

export const OfflineQRCode = ({ text, size = 200, className = '' }: OfflineQRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      generateQRCode(canvasRef.current, text, size);
    }
  }, [text, size]);

  const generateQRCode = async (canvas: HTMLCanvasElement, text: string, size: number) => {
    try {
      // Generate real QR code using qrcode library
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      // Add subtle border for better definition
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, size, size);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      className={`max-w-full max-h-full border border-gray-200 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}; 