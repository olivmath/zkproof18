import { Card } from './Card';
import { Button } from './Button';
import { TonConnectButton } from '@tonconnect/ui-react';

interface LoginScreenProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
}

export const LoginScreen = ({ onConnectWallet, isConnecting }: LoginScreenProps) => {
  return (
    <div className="fixed right-6 bottom-6 z-20">
      <TonConnectButton />
    </div>
  );
};