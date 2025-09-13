export interface ProofData {
  id: string;
  proofCode: string;
  birthYear: number;
  verifiedDate: string;
  status: 'Verified';
  type?: 'standard' | 'premium' | 'vip'; // Novo campo para tipos de ticket
  eventName?: string; // Nome do evento
  location?: string; // Local do evento
}

export interface WalletProofs {
  [walletAddress: string]: ProofData[];
}

export interface TicketTheme {
  background: string;
  accent: string;
  text: string;
  border: string;
}

export const TICKET_THEMES: Record<string, TicketTheme> = {
  standard: {
    background: 'from-gray-800 to-gray-900',
    accent: 'text-blue-400',
    text: 'text-white',
    border: 'border-gray-600'
  },
  premium: {
    background: 'from-purple-800 to-purple-900',
    accent: 'text-purple-300',
    text: 'text-white',
    border: 'border-purple-500'
  },
  vip: {
    background: 'from-yellow-600 to-yellow-700',
    accent: 'text-yellow-200',
    text: 'text-black',
    border: 'border-yellow-400'
  }
};