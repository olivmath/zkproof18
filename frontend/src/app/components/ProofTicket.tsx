interface ProofTicketProps {
  title: string;
  subtitle: string;
  wallet: string;
  nullifier: string;
  date: string;
  status?: string;
}

export const ProofTicket = ({ title, subtitle, wallet, nullifier, date, status }: ProofTicketProps) => {
  return (
    <div className="bg-white text-black rounded-lg p-6 my-5 relative overflow-visible">
      {/* Ticket border with dots */}
      <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-dashed border-black rounded-lg pointer-events-none">
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black rounded-full"></div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black rounded-full"></div>
      </div>
      
      <div className="text-center border-b border-dashed border-black pb-4 mb-4">
        <div className="text-lg font-bold tracking-wider mb-1">{title}</div>
        <div className="text-xs text-gray-600 tracking-wider">{subtitle}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {status && (
            <>
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Status</div>
              <div className="text-sm font-medium mb-3">{status}</div>
            </>
          )}
          
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Wallet</div>
          <div className="text-sm font-medium mb-3">{wallet}</div>
          
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Nullifier</div>
          <div className="text-sm font-medium mb-3">{nullifier}</div>
          
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
            {status ? 'Verified On' : 'Verified'}
          </div>
          <div className="text-sm font-medium">{date}</div>
        </div>
        
        <div className="w-15 h-15 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl ml-4">
          ✓
        </div>
      </div>
    </div>
  );
}; 