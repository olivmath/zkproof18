import { Barcode } from "./BarCode";

interface TicketCardProps {
  proofSize: string;
  txHash: string;
  proofType: string;
  blockNumber: number;
  extrinsicIndex: number;
  proofCode: string;
  fee: string;
  date: string;
}

export const TicketCard = ({ proofSize, txHash, proofType, blockNumber, extrinsicIndex, proofCode, fee, date }: TicketCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr.split(' ')[0].split('/').reverse().join('-') + 'T' + dateStr.split(' ')[1]);
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    
    return { time, day, month, year };
  };

  const { time, day, month, year } = formatDate(date);

  return (
    <div className="relative bg-white border-2 border-black rounded-lg overflow-hidden min-w-[600px] max-w-[620px] h-[180px] shadow-lg font-retro">
      <div className="flex h-full">
        {/* Left section - Dark gray */}
        <div className="w-32 bg-gray-600 text-white p-3 flex flex-col justify-between">
          <div>
            <div className="text-xs mb-1">BLOCK HASH</div>
            <div className="text-sm font-bold mb-3">0x{txHash.slice(2, 8)}</div>
            
            <div className="text-xs mb-1">TX HASH</div>
            <div className="text-sm font-bold">0x{txHash.slice(2, 8)}</div>
          </div>
          
          <div>
            <div className="text-lg font-bold">{time}</div>
            <div className="text-sm">{day}{month}{year}</div>
          </div>
        </div>

        {/* Middle section - White */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-orange-500 text-sm mb-1">Block Number</div>
              <div className="text-black text-lg font-bold">{blockNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-orange-500 text-sm mb-1">Fee</div>
              <div className="text-black text-lg font-bold">{fee}</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-black text-2xl font-bold tracking-wider">
              {proofType.toUpperCase()} <span className="italic">PROOF</span>
            </div>
          </div>
          
          <div>
            <div className="text-orange-500 text-sm mb-1">Proof Size</div>
            <div className="text-black text-lg font-bold">{proofSize} Bytes</div>
          </div>
        </div>

        {/* Tear line */}
        <div className="w-px border-l border-dashed border-black"></div>

        {/* Right section - Gray with barcode */}
        <div className="w-20 bg-gray-400 text-black flex flex-col items-center justify-center p-2 relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="transform -rotate-90">
              <Barcode value={proofCode} />
            </div>
          </div>
          <div className="transform -rotate-90 text-sm font-bold whitespace-nowrap absolute bottom-4">
            {proofCode}
          </div>
        </div>
      </div>
    </div>
  );
};