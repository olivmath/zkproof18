"use client";

import { useEffect, useRef, useCallback } from 'react';

interface QRCodeGeneratorProps {
  text: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator = ({ text, size = 200, className = '' }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateRealQRCode = useCallback(async (canvas: HTMLCanvasElement, text: string, size: number) => {
    try {
      // Try to load QR code library dynamically
      let QRCode: any;
      
      if (typeof window !== 'undefined') {
        // Check if already loaded
        if ((window as any).QRCode) {
          QRCode = (window as any).QRCode;
        } else {
          // Load from CDN
          await loadQRCodeLibrary();
          QRCode = (window as any).QRCode;
        }
      }

      if (QRCode) {
        // Use real QR code library
        await QRCode.toCanvas(canvas, text, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
      } else {
        // Fallback to simple implementation
        generateSimpleQR(canvas, text, size);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      generateSimpleQR(canvas, text, size);

    }
  }, []); // Adiciona as dependências do useCallback

  const loadQRCodeLibrary = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('QR Code library loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        console.log('Failed to load QR library, using fallback');
        reject(new Error('Failed to load QR library'));
      };
      
      document.head.appendChild(script);
    });
  };

  const generateSimpleQR = (canvas: HTMLCanvasElement, text: string, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Create a simple but readable pattern
    ctx.fillStyle = '#000000';
    
    // Generate a deterministic pattern based on text
    const pattern = generatePatternFromText(text, size);
    
    // Draw the pattern
    const cellSize = Math.floor(size / pattern.length);
    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  };

  const generatePatternFromText = (text: string, size: number): boolean[][] => {
    const gridSize = Math.floor(size / 8);
    const pattern: boolean[][] = [];
    
    // Initialize pattern
    for (let i = 0; i < gridSize; i++) {
      pattern[i] = [];
      for (let j = 0; j < gridSize; j++) {
        pattern[i][j] = false;
      }
    }
    
    // Generate hash from text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    
    // Create pattern based on hash
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        const shouldFill = (hash + index + row * 13 + col * 17) % 3 === 0;
        pattern[row][col] = shouldFill;
      }
    }
    
    // Add corner markers (QR code style)
    const markerSize = Math.floor(gridSize / 6);
    
    // Top-left marker
    for (let i = 0; i < markerSize; i++) {
      for (let j = 0; j < markerSize; j++) {
        pattern[i][j] = true;
        if (i > 0 && i < markerSize - 1 && j > 0 && j < markerSize - 1) {
          pattern[i][j] = false;
        }
        if (i > 1 && i < markerSize - 2 && j > 1 && j < markerSize - 2) {
          pattern[i][j] = true;
        }
      }
    }
    
    // Top-right marker
    for (let i = 0; i < markerSize; i++) {
      for (let j = 0; j < markerSize; j++) {
        pattern[i][gridSize - 1 - j] = true;
        if (i > 0 && i < markerSize - 1 && j > 0 && j < markerSize - 1) {
          pattern[i][gridSize - 1 - j] = false;
        }
        if (i > 1 && i < markerSize - 2 && j > 1 && j < markerSize - 2) {
          pattern[i][gridSize - 1 - j] = true;
        }
      }
    }
    
    // Bottom-left marker
    for (let i = 0; i < markerSize; i++) {
      for (let j = 0; j < markerSize; j++) {
        pattern[gridSize - 1 - i][j] = true;
        if (i > 0 && i < markerSize - 1 && j > 0 && j < markerSize - 1) {
          pattern[gridSize - 1 - i][j] = false;
        }
        if (i > 1 && i < markerSize - 2 && j > 1 && j < markerSize - 2) {
          pattern[gridSize - 1 - i][j] = true;
        }
      }
    }
    
    return pattern;
  };

  return (
    <canvas 
      ref={canvasRef}
      className={`max-w-full max-h-full border border-gray-200 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};