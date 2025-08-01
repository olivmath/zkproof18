"use client";

import { useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { GameOfLife } from "./components/GameOfLife";
import { Header } from "./components/Header";
import { WalletStatus } from "./components/WalletStatus";
import { GenerateProofForm } from "./components/GenerateProofForm";
import { SuccessSection } from "./components/SuccessSection";
import { LoginScreen } from "./components/LoginScreen";
import { useState, useEffect } from "react";
import { Address } from "@ton/core";
import { setWalletAddress, serverLog } from "./utils/serverLogger";

function HomeContent() {
  const wallet = useTonWallet();
  const [currentView, setCurrentView] = useState<'main' | 'generate' | 'success'>('main');
  const [proofData, setProofData] = useState<any>(null);

  // Verificar localStorage quando wallet conectar
  useEffect(() => {
    if (wallet?.account?.address) {
      try {
        const walletAddress = Address.parse(wallet.account.address).toString({ urlSafe: true, bounceable: false });
        setWalletAddress(walletAddress);
        const savedTxHash = localStorage.getItem(walletAddress);
        
        if (savedTxHash) {
          // Se tem txHash salvo, mostrar QR code
          setProofData({ txHash: savedTxHash });
          setCurrentView('success');
        }
      } catch (error) {
        serverLog.error('Error checking localStorage', error);
      }
    } else {
      setWalletAddress(null);
    }
  }, [wallet]);

  const handleStartProofGeneration = () => {
    setCurrentView('generate');
  };

  const handleProofGenerated = (data: any) => {
    setProofData(data);
    setCurrentView('success');
  };

  const handleNewProof = () => {
    // Limpar localStorage ao gerar nova prova
    if (wallet?.account?.address) {
      try {
        const walletAddress = Address.parse(wallet.account.address).toString({ urlSafe: true, bounceable: false });
        localStorage.removeItem(walletAddress);
      } catch (error) {
        serverLog.error('Error clearing localStorage', error);
      }
    }
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
