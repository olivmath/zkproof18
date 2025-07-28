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
    <div className="ticket">
      <div className="ticket-border"></div>
      <div className="ticket-header">
        <div className="ticket-title">PROOF VERIFIED</div>
        <div className="ticket-subtitle">Valid Age Confirmation</div>
      </div>
      <div className="ticket-body">
        <div className="ticket-info">
          <div className="ticket-label">Wallet</div>
          <div className="ticket-value">{shortWallet(wallet)}</div>
          <div className="ticket-label">Status</div>
          <div className="ticket-value">18+ CONFIRMED</div>
          <div className="ticket-label">Verified</div>
          <div className="ticket-value">{date}</div>
        </div>
        <div className="check-icon">✓</div>
      </div>
    </div>
  );
} 