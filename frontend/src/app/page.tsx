"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { GameOfLife } from "./components/GameOfLife";
import { Header } from "./components/Header";
import { WalletStatus } from "./components/WalletStatus";
import { Button } from "./components/Button";
import { GenerateProofForm } from "./components/GenerateProofForm";
import { SuccessSection } from "./components/SuccessSection";
import { LoginScreen } from "./components/LoginScreen";
import { useState } from "react";


function HomeContent() {
  const wallet = useTonWallet();
  const [currentView, setCurrentView] = useState<'main' | 'generate' | 'success'>('main');
  const [proofData, setProofData] = useState<any>(null);

  const handleStartProofGeneration = () => {
    setCurrentView('generate');
  };

  const handleProofGenerated = (data: any) => {
    setProofData(data);
    setCurrentView('success');
  };

  const handleNewProof = () => {
    setCurrentView('main');
    setProofData(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
      <GameOfLife />
      
      <div className="relative z-10 max-w-md mx-auto p-5 min-h-screen flex flex-col">
        <Header />
        
        {!wallet ? (
          <LoginScreen 
            onConnectWallet={() => {}}
            isConnecting={false}
          />
        ) : (
          <div className="flex-1 flex flex-col gap-5">
            <WalletStatus />
            
            {currentView === 'main' && (
              <div className="flex-1 flex items-center justify-center">
                <Button 
                  onClick={handleStartProofGeneration}
                  className="text-lg py-8 text-center"
                >
                  GENERATE YOUR 18+ PROOF
                </Button>
              </div>
            )}
            
            {currentView === 'generate' && (
              <GenerateProofForm onProofGenerated={handleProofGenerated} />
            )}
            
            {currentView === 'success' && proofData && (
              <SuccessSection 
                proofData={proofData}
                onNewProof={handleNewProof}
              />
            )}
          </div>
        )}
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
