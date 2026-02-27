import { QrGenerator } from '@/components/admin/QrGenerator';

export default function AdminQrPage() {
  return (
    <div className="min-h-screen relative overflow-hidden print:min-h-0 print:overflow-visible print:bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 print:hidden">
        {/* Decorative Icons Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="icons-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                {/* QR Code Icon */}
                <rect x="20" y="20" width="30" height="30" fill="currentColor" opacity="0.3" />
                <rect x="25" y="25" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
                
                {/* Gear Icon */}
                <circle cx="150" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <circle cx="150" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                
                {/* Star Icon */}
                <path d="M 80 140 L 85 155 L 100 157 L 90 167 L 93 182 L 80 174 L 67 182 L 70 167 L 60 157 L 75 155 Z" fill="currentColor" opacity="0.2" />
                
                {/* Document Icon */}
                <rect x="130" y="140" width="25" height="35" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <line x1="135" y1="150" x2="150" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <line x1="135" y1="157" x2="150" y2="157" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                
                {/* Tool Icon */}
                <circle cx="40" cy="170" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                <line x1="45" y1="175" x2="55" y2="185" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#icons-pattern)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen print:min-h-0 print:block print:p-0 print:m-0">
        <QrGenerator />
      </div>
    </div>
  );
}
