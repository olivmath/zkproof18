import { Card } from './Card';
import { Button } from './Button';
import { ProofTicket } from './ProofTicket';
import { useTonWallet } from '@tonconnect/ui-react';

interface VerifySuccessSectionProps {
  verificationData: any;
  onVerifyAnother: () => void;
}

export const VerifySuccessSection = ({ verificationData, onVerifyAnother }: VerifySuccessSectionProps) => {
  const wallet = useTonWallet();
  const walletAddress = wallet ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}` : 'UQB...7x2f';

  return (
    <Card>
      <ProofTicket
        title="PROOF VERIFIED"
        subtitle="Valid Age Confirmation"
        wallet={walletAddress}
        nullifier={verificationData.nullifier}
        date={verificationData.verifiedDate}
        status={verificationData.status}
      />
      
      <Button onClick={onVerifyAnother}>
        VERIFY ANOTHER PROOF
      </Button>
    </Card>
  );
}; 