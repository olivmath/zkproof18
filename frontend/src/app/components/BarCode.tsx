"use client";

import { useEffect, useRef } from 'react';
import React from 'react';

interface BarCodeProps {
  value: string;
  width?: number;
  height?: number;
  className?: string;
}

interface BarcodeProps {
  value: string;
}

export const Barcode = ({ value }: BarcodeProps) => {
  // Generate barcode-like pattern based on the value
  const generateBars = (text: string): React.ReactElement[] => {
    const bars: React.ReactElement[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const width = (charCode % 4) + 1; // Width between 1-4
      const height = (charCode % 3) + 2; // Height variation
      bars.push(
        <div
          key={i}
          className="bg-black inline-block mr-px"
          style={{
            width: `${width}px`,
            height: `${height * 8}px`,
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div className="flex items-end justify-center h-16 w-12">
      {generateBars(value)}
    </div>
  );
};

export const BarCode = ({ value, width = 2, height = 100, className = '' }: BarCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      // Simular código de barras com linhas verticais
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#000000';
        // Criar padrão de barras baseado no valor
        const barWidth = width;
        let x = 10;
        for (let i = 0; i < value.length && x < canvas.width - 10; i++) {
          const charCode = value.charCodeAt(i);
          if (charCode % 2 === 0) {
            ctx.fillRect(x, 10, barWidth, height);
          }
          x += barWidth + 1;
        }
      }
    }
  }, [value, width, height]);

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas 
        ref={canvasRef}
        width={150}
        height={height + 20}
        className="transform rotate-90 border border-gray-300"
      />
    </div>
  );
};