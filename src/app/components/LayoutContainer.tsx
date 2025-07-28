import React from "react";
import { GameOfLifeBackground } from "./GameOfLifeBackground";

export function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white font-mono">
      <GameOfLifeBackground />
      <div className="relative z-10 flex flex-col items-center min-h-screen justify-center py-8 px-2">
        {children}
      </div>
    </div>
  );
} 