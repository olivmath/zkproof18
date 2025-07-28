import './globals.css';
import type { Metadata } from 'next';
import { GameOfLifeBackground } from "./components/GameOfLifeBackground";

export const metadata: Metadata = {
  title: 'ZK Age Proof',
  description: 'Zero Knowledge Age Proof App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-neutral-950 text-white font-mono min-h-screen">
        {/* Game of Life Background */}
        <div className="fixed inset-0 z-0">
          <GameOfLifeBackground />
        </div>
        <div className="relative z-10 max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
} 