"use client";

import { ProofTicket } from "./ProofTicket";
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
  const [currentIndex, setCurrentIndex] = useState(0);

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
      if (savedProofs.length > 0) {
        setCurrentIndex(savedProofs.length - 1); // Mostrar a mais recente
      }
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
        setCurrentIndex(updatedProofs.length - 1);
      }
    }
  }, [proofData, wallet, walletAddress]);

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : proofs.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < proofs.length - 1 ? prev + 1 : 0);
  };

  if (proofs.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p>Nenhuma prova encontrada</p>
      </div>
    );
  }

  const currentProof = proofs[currentIndex];

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Navegação */}
      {proofs.length > 1 && (
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} de {proofs.length}
          </span>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
          >
            →
          </button>
        </div>
      )}
      
      {/* Ticket da Prova */}
      <ProofTicket
        proof={currentProof}
        wallet={walletAddress}
        onNewProof={onNewProof}
      />
      
      {/* Indicadores */}
      {proofs.length > 1 && (
        <div className="flex gap-2 mt-4">
          {proofs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
