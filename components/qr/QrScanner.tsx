import { Scanner } from '@yudiel/react-qr-scanner';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface QrScannerProps {
  className?: string;
  onScan?: (result: string) => void;
  onError?: (error: unknown) => void;
}

export function QrScanner({ className, onScan, onError }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      if (rawValue && onScan) {
        setIsScanning(false); // Stop scanning on success to prevent multiple triggers
        onScan(rawValue);
        // Optional: Re-enable scanning after delay if needed, but usually we redirect
      }
    }
  };

  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-3xl',
        className
      )}
    >
      {/* Real Camera Scanner */}
      <div className="absolute inset-0 z-0">
          <Scanner 
              onScan={handleScan}
              onError={(err) => onError?.(err)}
              components={{
                  finder: false, // We use our own custom UI
              }}
              styles={{
                  container: { width: '100%', height: '100%' },
                  video: { width: '100%', height: '100%', objectFit: 'cover' }
              }}
          />
      </div>

      {/* Scanner frame with gradient background - Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-600/10" />
        
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-blue-400 rounded-tl-2xl shadow-sm" />
        <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-blue-400 rounded-tr-2xl shadow-sm" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-blue-400 rounded-bl-2xl shadow-sm" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-blue-400 rounded-br-2xl shadow-sm" />

        {/* Center Guide (Optional, removed specific QR pattern to show camera) */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white/20 rounded-xl" />
        </div>

        {/* Scanning line animation */}
        <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
      </div>
    </div>
  );
}
