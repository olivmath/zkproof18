"use client";
import React from "react";

interface TransactionResultProps {
  txHash: string;
  isVisible: boolean;
}

export function TransactionResult({ txHash, isVisible }: TransactionResultProps) {
  if (!isVisible) return null;

  const subscanUrl = `https://zkverify-testnet.subscan.io/extrinsic/${txHash}`;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-lg">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🎉</div>
        <h3 className="text-xl font-bold text-green-800 mb-3">
          Prova Enviada com Sucesso!
        </h3>
        <p className="text-sm text-green-700 mb-6">
          Sua prova foi submetida e verificada na blockchain zkVerify testnet.
        </p>
        
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-green-200 mb-6">
          <p className="text-xs text-gray-600 mb-2 font-medium">Transaction Hash:</p>
          <div className="bg-gray-100 p-2 rounded border">
            <p className="text-xs font-mono text-green-800 break-all">{txHash}</p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={subscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Verificar no Subscan
          </a>
          
          <div className="text-xs text-green-600">
            🔗 Clique para ver a transação na blockchain
          </div>
        </div>
      </div>
    </div>
  );
} 