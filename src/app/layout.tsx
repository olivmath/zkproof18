import './globals.css';
import type { Metadata } from 'next';

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
      <body className="bg-black text-white font-mono min-h-screen">{children}</body>
    </html>
  );
} 