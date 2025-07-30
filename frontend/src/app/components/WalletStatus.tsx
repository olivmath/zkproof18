import { useTonWallet } from '@tonconnect/ui-react';

export const WalletStatus = () => {
  const wallet = useTonWallet();

  if (!wallet) return null;

  return (
    <div className="flex items-center gap-3 mb-4 p-3 bg-black border border-gray-700 rounded">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div>
        <div className="text-xs">TON WALLET CONNECTED</div>
        <div className="text-xs text-gray-500 font-mono">
          {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
        </div>
      </div>
    </div>
  );
}; 