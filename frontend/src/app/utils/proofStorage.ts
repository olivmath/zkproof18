import { ProofData, WalletProofs } from '../types/proof';

const STORAGE_KEY = 'wallet_proofs';

export const proofStorage = {
  // Salvar nova prova
  saveProof: (walletAddress: string, proofData: Omit<ProofData, 'id'>) => {
    try {
      const allProofs = proofStorage.getAllProofs();
      const walletProofs = allProofs[walletAddress] || [];
      
      const newProof: ProofData = {
        ...proofData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      
      walletProofs.push(newProof);
      allProofs[walletAddress] = walletProofs;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProofs));
      return newProof;
    } catch (error) {
      console.error('Error saving proof:', error);
      return null;
    }
  },

  // Obter todas as provas de uma carteira
  getWalletProofs: (walletAddress: string): ProofData[] => {
    try {
      const allProofs = proofStorage.getAllProofs();
      return allProofs[walletAddress] || [];
    } catch (error) {
      console.error('Error getting wallet proofs:', error);
      return [];
    }
  },

  // Obter todas as provas
  getAllProofs: (): WalletProofs => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting all proofs:', error);
      return {};
    }
  },

  // Limpar provas de uma carteira
  clearWalletProofs: (walletAddress: string) => {
    try {
      const allProofs = proofStorage.getAllProofs();
      delete allProofs[walletAddress];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProofs));
    } catch (error) {
      console.error('Error clearing wallet proofs:', error);
    }
  }
};