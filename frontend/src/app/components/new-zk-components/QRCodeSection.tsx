import { OfflineQRCode } from './OfflineQRCode';

interface QRCodeSectionProps {
  proofUrl: string;
}

export const QRCodeSection = ({ proofUrl }: QRCodeSectionProps) => {
  return (
    <div className="text-center py-5">
      <div className="w-50 h-50 bg-white mx-auto mb-4 flex items-center justify-center rounded p-4">
                     <OfflineQRCode
               text={proofUrl}
               size={200}
               className="border border-gray-200"
             />
      </div>
      <div className="text-xs text-gray-500 break-all mb-5">
        {proofUrl}
      </div>
      <div className="text-xs text-gray-400">
        Scan to view proof
      </div>
    </div>
  );
}; 