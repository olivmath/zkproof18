'use client';

import React from "react";
import { QRCodeSVG } from 'qrcode.react';

export function QRCodeBox({ proofUrl }: { proofUrl: string }) {
  return (
    <div className="qr-section text-center py-6">
      <div className="qr-code bg-white rounded-md border border-neutral-300 flex items-center justify-center w-[200px] h-[200px] mx-auto mb-4">
        {proofUrl ? (
          <QRCodeSVG value={proofUrl} size={180} fgColor="#000" bgColor="#fff" />
        ) : (
          <div className="text-xs text-black">QR CODE<br/>PLACEHOLDER</div>
        )}
      </div>
      <div className="proof-link text-xs text-neutral-500 break-all font-mono text-center max-w-xs mx-auto">
        {proofUrl}
      </div>
    </div>
  );
} 