import React from "react";

export function WalletStatus({ address }: { address: string }) {
  return (
    <div className="wallet-status">
      <div className="wallet-indicator"></div>
      <div>
        <div style={{ fontSize: 12 }}>TON WALLET CONNECTED</div>
        <div className="wallet-address">{address}</div>
      </div>
    </div>
  );
} 