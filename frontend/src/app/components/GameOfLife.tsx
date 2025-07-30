"use client";

import { useEffect, useRef } from 'react';

export const GameOfLife = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 8;
    const cols = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let grid: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));

    // Initialize grid with random cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid[row][col] = Math.random() > 0.8 ? 1 : 0;
      }
    }

    const countNeighbors = (grid: number[][], x: number, y: number) => {
      let count = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;
          
          let row = (x + i + rows) % rows;
          let col = (y + j + cols) % cols;
          count += grid[row][col];
        }
      }
      return count;
    };

    const nextGeneration = () => {
      const newGrid = Array(rows).fill(0).map(() => Array(cols).fill(0));
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const neighbors = countNeighbors(grid, row, col);
          const current = grid[row][col];
          
          if (current === 1 && (neighbors === 2 || neighbors === 3)) {
            newGrid[row][col] = 1;
          } else if (current === 0 && neighbors === 3) {
            newGrid[row][col] = 1;
          }
        }
      }
      
      grid = newGrid;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (grid[row][col] === 1) {
            ctx.fillRect(
              col * cellSize,
              row * cellSize,
              cellSize - 1,
              cellSize - 1
            );
          }
        }
      }
    };

    const animate = () => {
      draw();
      nextGeneration();
      setTimeout(() => animate(), 200);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-15"
      style={{ opacity: 0.15 }}
    />
  );
}; 