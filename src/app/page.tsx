'use client';

import React, { useState } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Header } from "./components/Header";
import { ActionSelector } from "./components/ActionSelector";
import { GenerateProofCard } from "./components/GenerateProofCard";
import { VerifyProofCard } from "./components/VerifyProofCard";
import { Ticket } from "./components/Ticket";
import { QRCodeBox } from "./components/QRCodeBox";
import { ToastProvider } from "./components/ToastProvider";
import { LayoutContainer } from "./components/LayoutContainer";

function WalletHeader({ walletAddress }: { walletAddress: string }) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mb-4">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <div>
          <div className="text-xs">TON WALLET CONNECTED</div>
          <div className="text-xs text-gray-400 font-mono">{walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)}</div>
        </div>
      </div>
      <TonConnectButton />
    </div>
  );
}

function MainContent({ walletAddress, onProofSuccess, onVerifySuccess }: { walletAddress: string, onProofSuccess: any, onVerifySuccess: any }) {
  const [currentAction, setCurrentAction] = useState<'generate' | 'verify'>("generate");
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <ActionSelector currentAction={currentAction} onSelect={setCurrentAction} />
      {currentAction === 'generate' && (
        <GenerateProofCard onSuccess={onProofSuccess} walletAddress={walletAddress} />
      )}
      {currentAction === 'verify' && (
        <VerifyProofCard onSuccess={onVerifySuccess} walletAddress={walletAddress} />
      )}
    </div>
  );
}

function SuccessSection({ ticketData, onReset, proofUrl, addWalletBtnText, addWalletBtnDisabled, onAddToWallet }: any) {
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Ticket wallet={ticketData.wallet} date={ticketData.date} />
      <QRCodeBox proofUrl={proofUrl} />
      <button className="btn btn-secondary" onClick={onAddToWallet} disabled={addWalletBtnDisabled}>{addWalletBtnText}</button>
      <button className="btn mt-3" onClick={onReset}>Generate Another Proof</button>
    </div>
  );
}

function VerifySuccessSection({ ticketData, onReset }: any) {
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Ticket wallet={ticketData.wallet} date={ticketData.date} />
      <button className="btn" onClick={onReset}>Verify Another Proof</button>
    </div>
  );
}

function HomeContent() {
  const wallet = useTonWallet();
  const walletAddress = wallet?.account?.address ? wallet.account.address : undefined;
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerifySuccess, setShowVerifySuccess] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [addWalletBtnText, setAddWalletBtnText] = useState("Add to Wallet");
  const [addWalletBtnDisabled, setAddWalletBtnDisabled] = useState(false);

  const handleProofSuccess = (data: { wallet: string; date: string; proofUrl: string; txHash: string }) => {
    setTicketData(data);
    setShowSuccess(true);
  };
  const handleVerifySuccess = (data: { wallet: string; date: string }) => {
    setTicketData(data);
    setShowVerifySuccess(true);
  };
  const handleResetToMain = () => {
    setShowSuccess(false);
    setTicketData(null);
  };
  const handleResetToVerify = () => {
    setShowVerifySuccess(false);
    setTicketData(null);
  };
  const handleAddToWallet = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    setAddWalletBtnText("ADDED TO WALLET ✓");
    setAddWalletBtnDisabled(true);
    setTimeout(() => {
      alert(
        isIOS
          ? "Pass would be added to Apple Wallet in production. You would need Apple Developer certificates and a backend to sign the pass."
          : isAndroid
          ? "Pass would be added to Google Wallet in production. Você precisaria de credenciais de serviço Google e JWT signing."
          : "Wallet integration not supported on this device"
      );
    }, 500);
  };

  return (
    <LayoutContainer>
      <ToastProvider />
      {walletAddress && <WalletHeader walletAddress={walletAddress} />}
      <Header />
      {!walletAddress && (
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="card">
            <div className="card-title">Connect TON Wallet</div>
            <div className="card-description">
              Connect your TON wallet to generate or verify zero-knowledge age proofs. Your private keys never leave your device.
            </div>
            <TonConnectButton />
          </div>
        </div>
      )}
      {walletAddress && !showSuccess && !showVerifySuccess && (
        <MainContent
          walletAddress={walletAddress}
          onProofSuccess={handleProofSuccess}
          onVerifySuccess={handleVerifySuccess}
        />
      )}
      {showSuccess && ticketData && (
        <SuccessSection
          ticketData={ticketData}
          onReset={handleResetToMain}
          proofUrl={ticketData.proofUrl}
          addWalletBtnText={addWalletBtnText}
          addWalletBtnDisabled={addWalletBtnDisabled}
          onAddToWallet={handleAddToWallet}
        />
      )}
      {showVerifySuccess && ticketData && (
        <VerifySuccessSection ticketData={ticketData} onReset={handleResetToVerify} />
      )}
    </LayoutContainer>
  );
}

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://yellow-accused-earwig-831.mypinata.cloud/ipfs/bafkreia7xookhxwowo5pizgjoaj3rc4tziijgu3sf62gfgule24qo47hvy">
      <HomeContent />
    </TonConnectUIProvider>
  );
}
