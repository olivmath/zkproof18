"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { HelloWorld } from "./components/HelloWorld";
import { BirthdayForm } from "./components/BirthdayForm";
import React from "react";

function HomeContent() {
  const wallet = useTonWallet();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-foreground/5 relative">
      {wallet ? <BirthdayForm /> : <HelloWorld />}
      <div
        className={`fixed right-6 transition-all duration-300 ease-in-out bottom-35`}
      >
        <TonConnectButton />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://yellow-accused-earwig-831.mypinata.cloud/ipfs/bafkreia7xookhxwowo5pizgjoaj3rc4tziijgu3sf62gfgule24qo47hvy">
      <HomeContent />
    </TonConnectUIProvider>
  );
}
