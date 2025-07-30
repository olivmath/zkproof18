import { Card } from './Card';
import { Button } from './Button';
import { TonConnectButton } from '@tonconnect/ui-react';

interface LoginScreenProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
}

export const LoginScreen = ({ onConnectWallet, isConnecting }: LoginScreenProps) => {
  return (
    <div className="flex-1 flex flex-col gap-5">
      <Card>
        <div className="text-base font-medium mb-3">Connect TON Wallet</div>
        <div className="text-sm text-gray-400 leading-relaxed mb-5">
          Connect your TON wallet to generate or verify zero-knowledge age proofs. Your private keys never leave your device.
        </div>
        <div className="flex justify-center">
          <TonConnectButton />
        </div>
      </Card>
    </div>
  );
}; 