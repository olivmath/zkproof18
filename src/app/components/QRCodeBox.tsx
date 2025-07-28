'use client';

import React from "react";
import { QRCodeSVG } from 'qrcode.react';

export function QRCodeBox({ proofUrl }: { proofUrl: string }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center w-[200px] h-[200px] mb-4">
        <QRCodeSVG value={proofUrl} size={180} fgColor="#000" bgColor="#fff" />
      </div>
      <div className="text-xs text-gray-500 break-all font-mono text-center max-w-xs">
        {proofUrl}
      </div>
    </div>
  );
} 