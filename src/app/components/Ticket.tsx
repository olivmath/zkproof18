import React from "react";

type TicketProps = {
  wallet: string;
  date: string;
  nullifier?: string;
  title?: string;
  subtitle?: string;
  status?: string;
  statusColor?: string;
};

function shortWallet(address: string) {
  if (!address) return '';
  return address.slice(0, 4) + '...' + address.slice(-4);
}

export function Ticket({ wallet, date, nullifier, title = 'AGE VERIFIED', subtitle = 'Zero Knowledge Proof', status = '18+ CONFIRMED', statusColor = 'text-green-600' }: TicketProps) {
  return (
    <div className="ticket bg-white text-black rounded-lg p-6 my-5 relative overflow-visible flex flex-col gap-4">
      {/* Círculos laterais */}
      <div className="ticket-border absolute inset-0 border-2 border-dashed border-black rounded-lg pointer-events-none" />
      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-black rounded-full" />
      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-black rounded-full" />
      {/* Header */}
      <div className="ticket-header text-center border-b border-dashed border-black pb-4 mb-4">
        <div className="ticket-title text-lg font-bold tracking-widest mb-1">{title}</div>
        <div className="ticket-subtitle text-xs text-neutral-500 uppercase tracking-wider">{subtitle}</div>
      </div>
      {/* Corpo do ticket */}
      <div className="ticket-body flex flex-col gap-2">
        <div>
          <div className="ticket-label text-[10px] text-neutral-500 uppercase tracking-wider">Wallet</div>
          <div className="ticket-value text-base font-semibold font-mono">{shortWallet(wallet)}</div>
        </div>
        {nullifier && (
          <div>
            <div className="ticket-label text-[10px] text-neutral-500 uppercase tracking-wider">Nullifier</div>
            <div className="ticket-value text-base font-semibold font-mono">{nullifier}</div>
          </div>
        )}
        <div>
          <div className="ticket-label text-[10px] text-neutral-500 uppercase tracking-wider">Status</div>
          <div className={`ticket-value text-base font-semibold ${statusColor}`}>{status}</div>
        </div>
        <div>
          <div className="ticket-label text-[10px] text-neutral-500 uppercase tracking-wider">Verified</div>
          <div className="ticket-value text-base font-semibold font-mono">{date}</div>
        </div>
      </div>
      {/* Check verde */}
      <div className="flex justify-center mt-4">
        <div className="check-icon w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl">✓</div>
      </div>
    </div>
  );
} 