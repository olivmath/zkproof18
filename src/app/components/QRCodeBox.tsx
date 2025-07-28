'use client';

import React from "react";
import { QRCodeSVG } from 'qrcode.react';

export function QRCodeBox({ proofUrl }: { proofUrl: string }) {
  return (
    <div className="qr-section">
      <div className="qr-code" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <QRCodeSVG value={proofUrl} size={180} fgColor="#000" bgColor="#fff" />
      </div>
      <div className="proof-link">{proofUrl}</div>
    </div>
  );
} 