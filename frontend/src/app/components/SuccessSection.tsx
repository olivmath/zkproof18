"use client";

import { TicketCard } from "./TicketCard";
import { useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { useState, useEffect } from "react";
import { proofStorage } from "../utils/proofStorage";
import { ProofData } from "../types/proof";

interface SuccessSectionProps {
  proofData?: any;
  onNewProof: () => void;
}

export const SuccessSection = ({
  proofData,
  onNewProof,
}: SuccessSectionProps) => {
  const wallet = useTonWallet();
  const [proofs, setProofs] = useState<ProofData[]>([]);

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

  // Carregar provas do localStorage
  useEffect(() => {
    if (wallet?.account?.address) {
      const savedProofs = proofStorage.getWalletProofs(walletAddress);
      setProofs(savedProofs);
    }
  }, [wallet, walletAddress]);

  // Salvar nova prova quando proofData for fornecido
  useEffect(() => {
    if (proofData && wallet?.account?.address) {
      const newProof = proofStorage.saveProof(walletAddress, {
        proofCode: proofData.proofCode || proofData.txHash,
        birthYear: proofData.birthYear,
        verifiedDate: proofData.verifiedDate || new Date().toISOString().split("T")[0],
        status: 'Verified'
      });
      
      if (newProof) {
        const updatedProofs = proofStorage.getWalletProofs(walletAddress);
        setProofs(updatedProofs);
      }
    }
  }, [proofData, wallet, walletAddress]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-lg font-medium">
          Recent Proofs ({proofs.length})
        </h2>
      </div>

      {/* Proofs Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {proofs.map((proof) => (
          <div key={proof.id} className="flex-shrink-0">
            <TicketCard
              proofSize="9978"
              txHash={proof.proofCode}
              proofType="ULTRAPLONK"
              blockNumber={1756993}
              extrinsicIndex={0}
              proofCode={proof.proofCode}
              fee="0.006858"
              date="01/08/25 08:39 PM"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          VERIFY PROOF
        </button>
        <button 
          onClick={onNewProof}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          GENERATE NEW PROOF
        </button>
      </div>
    </div>
  );
};
