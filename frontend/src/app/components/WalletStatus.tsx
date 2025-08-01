import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Button } from "./Button";
import { Address } from "@ton/core";

// Function to format TON address to show first and last 4 bytes
const formatTonAddress = (address: string) => {
  try {
    const tonAddress = Address.parse(address);
    const fullAddress = tonAddress.toString({
      urlSafe: true,
      bounceable: false,
    });
    return `${fullAddress.slice(0, 4)}...${fullAddress.slice(-4)}`;
  } catch (error) {
    console.error("Error formatting address:", error);
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
    <div className="flex items-center justify-between mb-4 p-4 bg-black border border-gray-700 rounded">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-100"></div>
        <div className="flex flex-col">
          <div className="text-xs text-white font-medium">
            TON WALLET CONNECTED
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {formattedAddress}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-800 text-white flex items-center gap-2 px-3 py-2 rounded transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
