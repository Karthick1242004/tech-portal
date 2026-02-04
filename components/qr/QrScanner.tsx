'use client';

import { cn } from '@/lib/utils';

interface QrScannerProps {
  className?: string;
}

export function QrScanner({ className }: QrScannerProps) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[280px] mx-auto',
        className
      )}
    >
      {/* Scanner frame with gradient background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-purple-600/20 p-6 backdrop-blur-sm">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-blue-400 rounded-tl-2xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-blue-400 rounded-tr-2xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-blue-400 rounded-bl-2xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-blue-400 rounded-br-2xl" />

        {/* Center QR code placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-lg shadow-lg flex items-center justify-center">
            {/* QR pattern simulation */}
            <div className="grid grid-cols-8 gap-0.5 w-28 h-28">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-full h-full',
                    Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scanning line animation */}
        <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
