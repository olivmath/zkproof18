"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { HelloWorld } from "./components/HelloWorld";
import { BirthdayForm } from "./components/BirthdayForm";

function HomeContent() {
  const wallet = useTonWallet();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-foreground/5 relative">
      {wallet ? <BirthdayForm /> : <HelloWorld />}
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
