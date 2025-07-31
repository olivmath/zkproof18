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
               className="border border-gray-200 bg-blue-500"
             />
      </div>
      <div className="text-xs">
        <a href={proofUrl} className="text-blue-500 hover:text-blue-700">
          Scan to view proof
        </a>
      </div>
    </div>
  );
}; 