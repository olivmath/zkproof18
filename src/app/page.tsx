'use client';

import { TonConnectButton } from '@tonconnect/ui-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://yellow-accused-earwig-831.mypinata.cloud/ipfs/bafkreif37arloqkzd76trz7edg534v26vqmd4ykxuwibgdelwr3m3xvbty">
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-foreground/5 relative">
        <div className="text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl md:text-7xl">
            Hello,{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              World!
            </span>
          </h1>
        </div>
        <div className="fixed bottom-6 right-6">
          <TonConnectButton />
        </div>
      </div>
    </TonConnectUIProvider>
  );
}
