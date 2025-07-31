"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { ProofTicket } from "./ProofTicket";
import { QRCodeSection } from "./QRCodeSection";
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
  
  console.log("🔍 SuccessSection proofData:", proofData);
  console.log("🔍 Final proofUrl:", proofUrl);

  return (
    <Card>
      <ProofTicket
        title="AGE VERIFIED"
        subtitle="Zero Knowledge Proof"
        wallet={walletAddress}
        date={proofData.verifiedDate}
      />
      <QRCodeSection proofUrl={proofUrl} />
      <Button onClick={onNewProof}>GENERATE ANOTHER PROOF</Button>
    </Card>
  );
};
