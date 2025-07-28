'use client';

import { useEffect, useRef } from 'react';

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Game of Life implementation
    let grid: boolean[][];
    const cellSize = 10;
    let animationId: number;

    const createGrid = () => {
      const rows = Math.ceil(canvas.height / cellSize);
      const cols = Math.ceil(canvas.width / cellSize);
      
      grid = [];
      for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
          grid[i][j] = Math.random() > 0.85;
        }
      }
    };

    const countNeighbors = (grid: boolean[][], x: number, y: number): number => {
      let sum = 0;
      const rows = grid.length;
      const cols = grid[0].length;
      
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;
          
          const row = (x + i + rows) % rows;
          const col = (y + j + cols) % cols;
          
          if (grid[row][col]) sum++;
        }
      }
      
      return sum;
    };

    const nextGeneration = () => {
      const newGrid = grid.map(arr => [...arr]);
      
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          const neighbors = countNeighbors(grid, i, j);
          
          // Game of Life rules
          if (grid[i][j] && (neighbors < 2 || neighbors > 3)) {
            newGrid[i][j] = false;
          } else if (!grid[i][j] && neighbors === 3) {
            newGrid[i][j] = true;
          }
        }
      }
      
      grid = newGrid;
    };

    const draw = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          if (grid[i][j]) {
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    const animate = () => {
      nextGeneration();
      draw();
      
      // Slow down the animation
      setTimeout(() => {
        animationId = requestAnimationFrame(animate);
      }, 100);
    };

    // Initialize and start animation
    createGrid();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} id="gameOfLife" />;
}
