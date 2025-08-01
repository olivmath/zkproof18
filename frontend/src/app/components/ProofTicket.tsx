import { ExternalLink, Camera } from 'lucide-react';
import { OfflineQRCode } from './OfflineQRCode';
import jsQR from 'jsqr';
import { serverLog } from '../utils/serverLogger';

interface ProofTicketProps {
  title: string;
  wallet: string;
  proofUrl: string;
  date: string;
  onNewProof: () => void;
}

export const ProofTicket = ({ title, wallet, proofUrl, date, onNewProof }: ProofTicketProps) => {
  
  // Função para truncar endereço
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Função para abrir proof
  const checkProof = () => {
    window.open(proofUrl, '_blank');
  };

  // Função para scan (câmera)
  const scanProof = async () => {
    try {
      // Verifica se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Câmera não suportada neste navegador');
        return;
      }

      // Solicita acesso à câmera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Câmera traseira preferencialmente
      });

      // Cria elementos para captura
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.srcObject = stream;
      video.play();

      // Cria overlay para mostrar a câmera
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      
      video.style.cssText = `
        width: 300px;
        height: 300px;
        border: 2px solid white;
        border-radius: 8px;
      `;
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fechar';
      closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;
      
      overlay.appendChild(video);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      // Função para processar frames
      const processFrame = async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0);

          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              serverLog.info('QR Code detectado:', code.data);
              
              // Faz requisição para verificar o resultado do link
              try {
                const response = await fetch(code.data);
                const result = await response.text();
                serverLog.info('Resultado do link:', result);
                
                // Verifica se o resultado contém "sucesso" (case-insensitive)
                if (result.toLowerCase().includes('sucesso')) {
                  serverLog.info('✅ Resultado contém "sucesso" - redirecionando...');
                  
                  // Para o stream da câmera
                  stream.getTracks().forEach(track => track.stop());
                  document.body.removeChild(overlay);
                  
                  // Redireciona para o link
                  window.open(code.data, '_blank');
                  return;
                } else {
                  serverLog.info('❌ Resultado não contém "sucesso"');
                  alert('Link verificado, mas resultado não contém "sucesso"');
                  stream.getTracks().forEach(track => track.stop());
                  document.body.removeChild(overlay);
                  return;
                }
              } catch (fetchError) {
                console.error('Erro ao verificar o link:', fetchError);
                serverLog.info('🔄 Tentando verificação alternativa...');
                
                // Fallback: verifica se o próprio QR code data contém "sucesso"
                if (code.data.toLowerCase().includes('sucesso')) {
                  serverLog.info('✅ QR Code data contém "sucesso" - redirecionando...');
                  
                  stream.getTracks().forEach(track => track.stop());
                  document.body.removeChild(overlay);
                  window.open(proofUrl, '_blank');
                  return;
                } else {
                  alert('Não foi possível verificar o link e QR code não contém "sucesso"');
                  stream.getTracks().forEach(track => track.stop());
                  document.body.removeChild(overlay);
                  return;
                }
              }
            }
          }
        }
        
        // Continua processando frames
        requestAnimationFrame(processFrame);
      };

      // Função para fechar
      const closeCamera = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      };
      
      closeBtn.onclick = closeCamera;
      overlay.onclick = (e) => {
        if (e.target === overlay) closeCamera();
      };

      // Inicia o processamento quando o vídeo estiver pronto
      video.onloadedmetadata = async () => {
        requestAnimationFrame(await processFrame);
      };

    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar a câmera. Verifique as permissões.');
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-8 max-w-md w-full backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-xl font-bold tracking-wider mb-1 text-white">{title}</div>
      </div>
      
      {/* QR Code Section */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
          <OfflineQRCode
            text={proofUrl}
            size={140}
            className="border border-gray-200"
          />
        </div>
      </div>
      
      {/* Wallet Info */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-gray-800/20 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-200 uppercase tracking-wider font-bold mb-1">
            Wallet Address
          </div>
          <div className="font-mono text-sm text-gray-400">
            {truncateAddress(wallet)}
          </div>
        </div>

        <div className="bg-gray-800/20 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-200 uppercase tracking-wider font-bold mb-2">
            Status
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-600 text-white rounded-full flex items-center justify-center">
              ✓
            </div>
            <span className="text-gray-400 text-sm">18+ CONFIRMED</span>
          </div>
        </div>
        
        <div className="bg-gray-800/20 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-200 uppercase tracking-wider font-bold mb-2">
            Verified
          </div>
          <div className="text-gray-400 text-xs">
            {date}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mb-4">
        <button
          onClick={scanProof}
          className="w-full bg-white hover:bg-gray-100 text-black py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md"
        >
          <Camera size={16} />
          VERIFY PROOF
        </button>
      </div>
      
      {/* Generate Another Proof Button */}
      <button
        onClick={onNewProof}
        className="w-3/4 mx-auto block bg-black/80 hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm transition-all duration-200 font-light"
      >
        GENERATE NEW PROOF
      </button>
      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-700 mt-4">
        <p className="text-xs text-gray-500 tracking-wider">
          Zero-knowledge proof tracked on ZkVerify
        </p>
      </div>
    </div>
  );
};