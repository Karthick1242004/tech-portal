'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import { cn } from '@/lib/utils';

interface QrScannerProps {
  onScan: (result: string) => void;
  className?: string;
}

export function QrScanner({ onScan, className }: QrScannerProps) {
  const handleScan = (detectedCodes: any) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const qrData = detectedCodes[0].rawValue;
      if (qrData) {
        onScan(qrData);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
  };

  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-3xl',
        className
      )}
    >
      <Scanner
        onScan={handleScan}
        onError={handleError}
        constraints={{
          facingMode: 'environment',
        }}
        styles={{
          container: {
            width: '100%',
            height: '100%',
          },
          video: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },
        }}
      />
      
      {/* Corner brackets overlay */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-blue-400 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-blue-400 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-blue-400 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-blue-400 rounded-br-2xl pointer-events-none" />
    </div>
  );
}
