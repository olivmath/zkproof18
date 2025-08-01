export interface ProofData {
  id: string;
  proofCode: string;
  birthYear: number;
  verifiedDate: string;
  status: 'Verified';
}

export interface WalletProofs {
  [walletAddress: string]: ProofData[];
}