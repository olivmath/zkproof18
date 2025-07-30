"use client";

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ProofTicket } from './ProofTicket';
import { QRCodeSection } from './QRCodeSection';
import { useTonWallet } from '@tonconnect/ui-react';

interface SuccessSectionProps {
  proofData: any;
  onNewProof: () => void;
}

export const SuccessSection = ({ proofData, onNewProof }: SuccessSectionProps) => {
  const [isAddedToWallet, setIsAddedToWallet] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const wallet = useTonWallet();

                  const walletAddress = wallet ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}` : 'UQB...7x2f';
        const proofUrl = `https://zkverify.io/proof/${proofData.proofHash}`;

  const handleAddToWallet = () => {
    // Detect if device supports wallet features
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // Apple Wallet integration would go here
      alert('Pass would be added to Apple Wallet in production. You would need Apple Developer certificates and a backend to sign the pass.');
    } else if (isAndroid) {
      // Google Wallet integration would go here
      alert('Pass would be added to Google Wallet in production. You would need Google service account credentials and JWT signing.');
    } else {
      alert('Wallet integration not supported on this device');
    }
    
    setIsAddedToWallet(true);
  };

  const handleShareProof = () => {
    const mockProof = {
      proof: "0x" + Array.from({length: 128}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      nullifier: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      timestamp: Date.now(),
      verified: true
    };
    
    navigator.clipboard.writeText(JSON.stringify(mockProof, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card>
      <ProofTicket
        title="AGE VERIFIED"
        subtitle="Zero Knowledge Proof"
        wallet={walletAddress}
        nullifier={proofData.nullifier}
        date={proofData.verifiedDate}
      />
      
                   <QRCodeSection proofUrl={proofUrl} />
      
      <Button 
        variant="secondary" 
        onClick={handleAddToWallet}
        disabled={isAddedToWallet}
        className="mb-3"
      >
        {isAddedToWallet ? 'ADDED TO WALLET ✓' : 'ADD TO WALLET'}
      </Button>
      
      <Button 
        variant="secondary" 
        onClick={handleShareProof}
        className="mb-3"
      >
        {isCopied ? 'COPIED!' : 'COPY PROOF DATA'}
      </Button>
      
      <Button onClick={onNewProof}>
        GENERATE ANOTHER PROOF
      </Button>
    </Card>
  );
}; 