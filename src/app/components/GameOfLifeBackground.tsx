'use client';

import React, { useRef, useEffect } from "react";

export function GameOfLifeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    class GameOfLife {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      cellSize = 8;
      cols: number;
      rows: number;
      grid: number[][];
      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.cellSize = 8;
        this.cols = Math.ceil(window.innerWidth / this.cellSize);
        this.rows = Math.ceil(window.innerHeight / this.cellSize);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.grid = this.createGrid();
        this.randomizeGrid();
        this.animate = this.animate.bind(this);
        this.animate();
      }
      createGrid() {
        return Array(this.rows)
          .fill(0)
          .map(() => Array(this.cols).fill(0));
      }
      randomizeGrid() {
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            this.grid[row][col] = Math.random() > 0.8 ? 1 : 0;
          }
        }
      }
      countNeighbors(grid: number[][], x: number, y: number) {
        let count = 0;
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            let row = (x + i + this.rows) % this.rows;
            let col = (y + j + this.cols) % this.cols;
            count += grid[row][col];
          }
        }
        return count;
      }
      nextGeneration() {
        const newGrid = this.createGrid();
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            const neighbors = this.countNeighbors(this.grid, row, col);
            const current = this.grid[row][col];
            if (current === 1 && (neighbors === 2 || neighbors === 3)) {
              newGrid[row][col] = 1;
            } else if (current === 0 && neighbors === 3) {
              newGrid[row][col] = 1;
            }
          }
        }
        this.grid = newGrid;
      }
      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            if (this.grid[row][col] === 1) {
              this.ctx.fillRect(
                col * this.cellSize,
                row * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
              );
            }
          }
        }
      }
      animate() {
        this.draw();
        this.nextGeneration();
        setTimeout(this.animate, 400);
      }
    }
    if (canvasRef.current) {
      let game = new GameOfLife(canvasRef.current);
      const handleResize = () => {
        game = new GameOfLife(canvasRef.current!);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-15 pointer-events-none" />
  );
} 