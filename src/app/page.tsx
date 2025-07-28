'use client';

import { useState, useEffect } from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import GameOfLife from './components/GameOfLife';
import { ToastProvider } from './components/ToastProvider';

function WalletHeader({ walletAddress }: { walletAddress: string }) {
  return (
    <div className="wallet-status">
      <div className="wallet-indicator"></div>
      <div className="wallet-address">
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </div>
      <TonConnectButton />
    </div>
  );
}

function ActionSelector({ 
  currentAction, 
  onSelect 
}: { 
  currentAction: 'generate' | 'verify', 
  onSelect: (action: 'generate' | 'verify') => void 
}) {
  return (
    <div className="action-selector">
      <div 
        className={`action-option ${currentAction === 'generate' ? 'selected' : ''}`}
        onClick={() => onSelect('generate')}
      >
        <div className="action-title">Generate Proof</div>
        <div className="action-desc">Create a new age proof</div>
      </div>
      <div 
        className={`action-option ${currentAction === 'verify' ? 'selected' : ''}`}
        onClick={() => onSelect('verify')}
      >
        <div className="action-title">Verify Proof</div>
        <div className="action-desc">Check an existing proof</div>
      </div>
    </div>
  );
}

function GenerateProofCard({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [birthDate, setBirthDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    if (!birthDate) return;
    
    setIsGenerating(true);
    
    // Simulate proof generation with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onSuccess({
              wallet: '0x1234...5678',
              date: new Date().toISOString().split('T')[0],
              proofUrl: 'https://zkproof.org/proof/123456',
              txHash: '0xabcdef1234567890'
            });
            setIsGenerating(false);
            setProgress(0);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="card">
      <div className="card-title">Generate Age Proof</div>
      <div className="card-description">
        Create a zero-knowledge proof of your age without revealing your actual birth date.
      </div>
      
      <div className="input-group">
        <label className="input-label">Your Birth Date</label>
        <input 
          type="date" 
          className="input-field"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          disabled={isGenerating}
        />
      </div>
      
      {isGenerating && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">Generating zero-knowledge proof...</div>
        </div>
      )}
      
      <button 
        className="btn" 
        onClick={handleGenerate}
        disabled={!birthDate || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Proof'}
      </button>
    </div>
  );
}

function VerifyProofCard({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [proofUrl, setProofUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!proofUrl) return;
    
    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      onSuccess({
        wallet: '0x1234...5678',
        date: '1990-01-01',
        status: 'verified',
        age: '33'
      });
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="card">
      <div className="card-title">Verify Age Proof</div>
      <div className="card-description">
        Verify a zero-knowledge age proof by entering the proof URL or scanning a QR code.
      </div>
      
      <div className="input-group">
        <label className="input-label">Proof URL</label>
        <input 
          type="text" 
          className="input-field"
          placeholder="https://zkproof.org/proof/..."
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          disabled={isVerifying}
        />
      </div>
      
      <div className="flex gap-4">
        <button 
          className="btn flex-1"
          onClick={() => {
            // In a real app, this would open the camera
            alert('Camera would open here to scan a QR code');
          }}
          disabled={isVerifying}
        >
          Scan QR Code
        </button>
        <button 
          className="btn flex-1"
          onClick={handleVerify}
          disabled={!proofUrl || isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Proof'}
        </button>
      </div>
    </div>
  );
}

function SuccessSection({ ticketData, onReset, onAddToWallet }: { 
  ticketData: any, 
  onReset: () => void,
  onAddToWallet: () => void
}) {
  return (
    <div className="card">
      <div className="ticket">
        <div className="ticket-border"></div>
        <div className="ticket-header">
          <div className="ticket-title">AGE VERIFICATION</div>
          <div className="ticket-subtitle">Zero-Knowledge Proof</div>
        </div>
        <div className="ticket-body">
          <div className="ticket-info">
            <div className="ticket-label">Wallet Address</div>
            <div className="ticket-value">{ticketData.wallet}</div>
          </div>
          <div className="ticket-icon">👤</div>
        </div>
        <div className="ticket-body mt-4">
          <div className="ticket-info">
            <div className="ticket-label">Date of Birth</div>
            <div className="ticket-value">{ticketData.date}</div>
          </div>
          <div className="ticket-icon">📅</div>
        </div>
      </div>
      
      <div className="qr-section">
        <div className="qr-code">
          {/* In a real app, this would be a QR code component */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📱</div>
            <div>Scan to verify</div>
          </div>
        </div>
        <div className="proof-link">
          {ticketData.proofUrl}
        </div>
      </div>
      
      <button 
        className="btn btn-secondary"
        onClick={onAddToWallet}
      >
        Add to Wallet
      </button>
      <button 
        className="btn mt-3"
        onClick={onReset}
      >
        Generate Another Proof
      </button>
    </div>
  );
}

function VerifySuccessSection({ ticketData, onReset }: { 
  ticketData: any, 
  onReset: () => void 
}) {
  return (
    <div className="card">
      <div className="ticket">
        <div className="ticket-border"></div>
        <div className="ticket-header">
          <div className="ticket-title">VERIFICATION SUCCESSFUL</div>
          <div className="ticket-subtitle">Age Verified</div>
        </div>
        <div className="ticket-body">
          <div className="ticket-info">
            <div className="ticket-label">Wallet Address</div>
            <div className="ticket-value">{ticketData.wallet}</div>
          </div>
          <div className="ticket-icon">✅</div>
        </div>
        <div className="ticket-body mt-4">
          <div className="ticket-info">
            <div className="ticket-label">Age Verified</div>
            <div className="ticket-value">{ticketData.age}+ years old</div>
          </div>
          <div className="ticket-icon">🔞</div>
        </div>
      </div>
      
      <button 
        className="btn mt-4"
        onClick={onReset}
      >
        Verify Another Proof
      </button>
    </div>
  );
}

function HomeContent() {
  const wallet = useTonWallet();
  const walletAddress = wallet?.account?.address || '';
  const [currentAction, setCurrentAction] = useState<'generate' | 'verify'>('generate');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerifySuccess, setShowVerifySuccess] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [addWalletBtnText, setAddWalletBtnText] = useState('Add to Wallet');
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);

  const handleProofSuccess = (data: any) => {
    setTicketData(data);
    setShowSuccess(true);
  };

  const handleVerifySuccess = (data: any) => {
    setTicketData(data);
    setShowVerifySuccess(true);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setShowVerifySuccess(false);
    setTicketData(null);
    setAddWalletBtnText('Add to Wallet');
    setIsAddingToWallet(false);
  };

  const handleAddToWallet = () => {
    setIsAddingToWallet(true);
    setAddWalletBtnText('Adding...');
    
    // Simulate adding to wallet
    setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      setAddWalletBtnText('Added to Wallet ✓');
      
      setTimeout(() => {
        alert(
          isIOS
            ? 'Pass would be added to Apple Wallet in production. You would need Apple Developer certificates and a backend to sign the pass.'
            : isAndroid
            ? 'Pass would be added to Google Wallet in production. Você precisaria de credenciais de serviço Google e JWT signing.'
            : 'Wallet integration not supported on this device'
        );
      }, 500);
    }, 1000);
  };

  return (
    <div className="container">
      <GameOfLife />
      
      <div className="header">
        <div className="logo">ZK_AGE_PROOF</div>
        <div className="tagline">Zero Knowledge Identity</div>
      </div>
      
      <div className="main-content">
        {walletAddress ? (
          <>
            {!showSuccess && !showVerifySuccess && (
              <>
                <ActionSelector 
                  currentAction={currentAction} 
                  onSelect={setCurrentAction} 
                />
                {currentAction === 'generate' ? (
                  <GenerateProofCard onSuccess={handleProofSuccess} />
                ) : (
                  <VerifyProofCard onSuccess={handleVerifySuccess} />
                )}
              </>
            )}
            
            {showSuccess && ticketData && (
              <SuccessSection 
                ticketData={ticketData} 
                onReset={handleReset}
                onAddToWallet={handleAddToWallet}
              />
            )}
            
            {showVerifySuccess && ticketData && (
              <VerifySuccessSection 
                ticketData={ticketData} 
                onReset={handleReset} 
              />
            )}
          </>
        ) : (
          <div className="card">
            <div className="card-title">Connect Wallet</div>
            <div className="card-description">
              Connect your wallet to generate or verify zero-knowledge age proofs. 
              Your private keys never leave your device.
            </div>
            <div className="mt-4">
              <TonConnectButton />
            </div>
          </div>
        )}
      </div>
      
      <ToastProvider />
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
