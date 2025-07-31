"use client";

import { ProofTicket } from "./ProofTicket";
import { useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

interface SuccessSectionProps {
  proofData: any;
  onNewProof: () => void;
}

export const SuccessSection = ({
  proofData,
  onNewProof,
}: SuccessSectionProps) => {
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

  const walletAddress = wallet
    ? formatTonAddress(wallet.account.address)
    : "UQB...7x2f";
  
  // Usar txHash real em vez de proofHash mockado
  const proofUrl = proofData.txHash 
    ? `https://zkverify-testnet.subscan.io/extrinsic/${proofData.txHash}`
    : `https://zkverify-testnet.subscan.io/extrinsic/no-hash-available`;

  return (
    <div className="flex justify-center">
      <ProofTicket
        title="AGE VERIFIED"
        wallet={walletAddress}
        proofUrl={proofUrl}
        date={proofData.verifiedDate || new Date().toLocaleDateString()}
        onNewProof={onNewProof}
      />
    </div>
  );
};
