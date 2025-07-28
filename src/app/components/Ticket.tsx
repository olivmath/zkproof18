import React from "react";

type TicketProps = {
  wallet: string;
  date: string;
};

function shortWallet(address: string) {
  if (!address) return '';
  return address.slice(0, 4) + '...' + address.slice(-4);
}

export function Ticket({ wallet, date }: TicketProps) {
  return (
    <div className="bg-white text-black rounded-xl p-6 my-4 relative overflow-visible shadow-lg flex flex-col gap-4">
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full" />
      <div className="absolute inset-0 border-2 border-dashed border-black rounded-xl pointer-events-none" />
      <div className="text-center border-b border-dashed border-black pb-4 mb-4">
        <div className="text-lg font-bold tracking-widest mb-1">PROOF VERIFIED</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">Valid Age Confirmation</div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Wallet</div>
          <div className="text-base font-semibold">{shortWallet(wallet)}</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Status</div>
          <div className="text-base font-semibold text-green-600">18+ CONFIRMED</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Verified</div>
          <div className="text-base font-semibold">{date}</div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl">✓</div>
      </div>
    </div>
  );
} 