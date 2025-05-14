"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

function HomeContent() {
  const wallet = useTonWallet();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-foreground/5 relative">
      <div className="text-center">
        <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl md:text-7xl">
          Hello,
          <br />{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {wallet ? "World!" : "_ _ _ _ _ !"}
          </span>
        </h1>
      </div>

      <div className="fixed bottom-35 right-6">
        <TonConnectButton className="tc-btn--up" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://yellow-accused-earwig-831.mypinata.cloud/ipfs/bafkreif37arloqkzd76trz7edg534v26vqmd4ykxuwibgdelwr3m3xvbty">
      <HomeContent />
    </TonConnectUIProvider>
  );
}
