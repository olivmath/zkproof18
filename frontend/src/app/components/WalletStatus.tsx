import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Button } from './Button';
import { Address } from '@ton/core';

// Função para converter endereço TON para formato user-friendly
const formatTonAddress = (address: string) => {
  console.log('Raw address:', address);
  
  try {
    // Usa a biblioteca @ton/core para converter o endereço
    const tonAddress = Address.parse(address);
    return tonAddress.toString({ urlSafe: true, bounceable: false });
  } catch (error) {
    console.error('Error formatting address:', error);
    return address;
  }
};

export const WalletStatus = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  if (!wallet) return null;

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
  };

  const formattedAddress = formatTonAddress(wallet.account.address);

  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-black border border-gray-700 rounded">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div>
          <div className="text-xs">TON WALLET CONNECTED</div>
          <div className="text-xs text-gray-500 font-mono">
            {formattedAddress.slice(0, 6)}...{formattedAddress.slice(-4)}
          </div>
        </div>
      </div>
      <Button 
        onClick={handleDisconnect}
        className="w-auto text-xs px-3 py-1 bg-white text-black hover:bg-gray-200 border-white font-medium"
      >
        DISCONNECT
      </Button>
    </div>
  );
}; 