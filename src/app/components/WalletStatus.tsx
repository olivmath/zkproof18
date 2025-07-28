import React from "react";

export function WalletStatus({ address }: { address: string }) {
  return (
    <div className="wallet-status flex items-center gap-3 mb-4 p-3 bg-neutral-950 border border-neutral-800 rounded-md">
      <div className="wallet-indicator w-2 h-2 bg-white rounded-full animate-pulse" />
      <div>
        <div className="text-[12px] uppercase tracking-wider text-white">TON WALLET CONNECTED</div>
        <div className="wallet-address text-[12px] text-neutral-400 font-mono">{address}</div>
      </div>
    </div>
  );
} 