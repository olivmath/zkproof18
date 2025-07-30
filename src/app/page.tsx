"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { GameOfLife } from "./components/new-zk-components/GameOfLife";
import { Header } from "./components/new-zk-components/Header";
import { WalletStatus } from "./components/new-zk-components/WalletStatus";
import { ActionSelector } from "./components/new-zk-components/ActionSelector";
import { GenerateProofForm } from "./components/new-zk-components/GenerateProofForm";
import { VerifyProofForm } from "./components/new-zk-components/VerifyProofForm";
import { SuccessSection } from "./components/new-zk-components/SuccessSection";
import { VerifySuccessSection } from "./components/new-zk-components/VerifySuccessSection";
import { LoginScreen } from "./components/new-zk-components/LoginScreen";
import { useState } from "react";
import { Toaster } from "sonner";

function HomeContent() {
  const wallet = useTonWallet();
  const [currentAction, setCurrentAction] = useState<'generate' | 'verify'>('generate');
  const [currentView, setCurrentView] = useState<'main' | 'success' | 'verify-success'>('main');
  const [proofData, setProofData] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>(null);

  const handleActionChange = (action: 'generate' | 'verify') => {
    setCurrentAction(action);
    setCurrentView('main');
  };

  const handleProofGenerated = (data: any) => {
    setProofData(data);
    setCurrentView('success');
  };

  const handleProofVerified = (data: any) => {
    setVerificationData(data);
    setCurrentView('verify-success');
  };

  const handleNewProof = () => {
    setCurrentView('main');
    setProofData(null);
  };

  const handleVerifyAnother = () => {
    setCurrentView('main');
    setVerificationData(null);
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
              <>
                <ActionSelector 
                  currentAction={currentAction}
                  onActionChange={handleActionChange}
                />
                
                {currentAction === 'generate' ? (
                  <GenerateProofForm onProofGenerated={handleProofGenerated} />
                ) : (
                  <VerifyProofForm onProofVerified={handleProofVerified} />
                )}
              </>
            )}
            
            {currentView === 'success' && proofData && (
              <SuccessSection 
                proofData={proofData}
                onNewProof={handleNewProof}
              />
            )}
            
            {currentView === 'verify-success' && verificationData && (
              <VerifySuccessSection 
                verificationData={verificationData}
                onVerifyAnother={handleVerifyAnother}
              />
            )}
          </div>
        )}
      </div>
      
      <div className="fixed right-6 bottom-6 z-20">
        <TonConnectButton />
      </div>
      
      <Toaster position="top-center" />
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
