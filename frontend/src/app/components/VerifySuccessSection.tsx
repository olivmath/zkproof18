import { Card } from './Card';
import { Button } from './Button';
import { ProofTicket } from './ProofTicket';
import { useTonWallet } from '@tonconnect/ui-react';
import { Address } from '@ton/core';

interface VerifySuccessSectionProps {
  verificationData: any;
  onVerifyAnother: () => void;
}

export const VerifySuccessSection = ({ verificationData, onVerifyAnother }: VerifySuccessSectionProps) => {
  const wallet = useTonWallet();
  
  // Função para converter endereço TON para formato user-friendly
  const formatTonAddress = (address: string) => {
    try {
      const tonAddress = Address.parse(address);
      return tonAddress.toString({ urlSafe: true, bounceable: false });
    } catch (error) {
      return address;
    }
  };

  const walletAddress = wallet ? formatTonAddress(wallet.account.address) : 'UQB...7x2f';

  return (
    <Card>
      <ProofTicket
        title="PROOF VERIFIED"
        wallet={walletAddress}
        proofUrl={verificationData.proofUrl || '#'}
        date={verificationData.verifiedDate}
        onNewProof={onVerifyAnother}
      />
      
      <Button onClick={onVerifyAnother}>
        VERIFY ANOTHER PROOF
      </Button>
    </Card>
  );
};