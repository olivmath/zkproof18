import { ExternalLink, Camera } from 'lucide-react';
import { BarCode } from './BarCode';

interface ProofData {
  id: string;
  proofCode: string;
  birthYear: number;
  verifiedDate: string;
  status: 'Verified';
}

interface ProofTicketProps {
  proof: ProofData;
  wallet: string;
  onNewProof: () => void;
}

export const ProofTicket = ({ proof, wallet, onNewProof }: ProofTicketProps) => {
  
  // Função para truncar endereço
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // URL usando proofCode
  const proofUrl = `https://zkverify-testnet.subscan.io/extrinsic/${proof.proofCode}`;

  // Função para abrir link externo
  const openExternalLink = () => {
    window.open(proofUrl, '_blank');
  };

  // Função para escanear código de barras
  const scanBarcode = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Criar overlay para câmera
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      
      const video = document.createElement('video');
      video.style.cssText = `
        width: 90%;
        max-width: 400px;
        height: auto;
        border: 2px solid white;
      `;
      video.srcObject = stream;
      video.play();
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fechar';
      closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: white;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;
      
      overlay.appendChild(video);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      
      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      };
      
      // Aqui você implementaria a lógica de leitura do código de barras
      // Por enquanto, apenas simula a verificação
      setTimeout(() => {
        alert('Código de barras verificado com sucesso!');
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      }, 3000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Erro ao acessar a câmera');
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-8 max-w-md w-full backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-xl font-bold tracking-wider mb-1 text-white">ZK_PROOF_18+</div>
        <div className="text-xs text-gray-400 tracking-wider">ZERO KNOWLEDGE IDENTITY</div>
      </div>
      
      {/* Status */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          TON WALLET CONNECTED
        </div>
        <div className="text-xs text-gray-400 mt-1">{truncateAddress(wallet)}</div>
      </div>
      
      {/* BarCode Section */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-600">
          <BarCode
            value={proof.proofCode}
            width={2}
            height={80}
            className=""
          />
        </div>
      </div>
      
      {/* Proof Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Wallet</span>
          <span className="text-white font-mono">{truncateAddress(wallet)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Status</span>
          <span className="text-green-400">{proof.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Date</span>
          <span className="text-white">{proof.verifiedDate}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        {/* External Link Button */}
        <button
          onClick={openExternalLink}
          className="w-full bg-white hover:bg-gray-100 text-black py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md"
        >
          <ExternalLink size={16} />
          VERIFY PROOF
        </button>
        
        {/* Scan Button */}
        <button
          onClick={scanBarcode}
          className="w-full bg-white hover:bg-gray-100 text-black py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md"
        >
          <Camera size={16} />
          VERIFY PROOF
        </button>
      </div>
      
      {/* Generate Another Proof Button */}
      <button
        onClick={onNewProof}
        className="w-3/4 mx-auto block bg-black/80 hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm transition-all duration-200 font-light mt-4"
      >
        GENERATE NEW PROOF
      </button>
    </div>
  );
};