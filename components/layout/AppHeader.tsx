'use client';

import { useSessionStore } from '@/store/session.store';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutGrid } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function AppHeader() {
  const { isAuthenticated, vendorId, userRole, clearSession } = useSessionStore();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image 
            src="/vone_logo.png" 
            alt="VOne Logo" 
            width={32} 
            height={32} 
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <h1 className="font-semibold text-lg">
              {userRole === 'admin' ? 'Admin Portal' : 'Tech Portal'}
            </h1>
            {isAuthenticated && (
              <span className="text-xs text-muted-foreground hidden sm:inline-block" role="status" aria-label="Current vendor">
                {vendorId || 'ACME Industrial Services'} • {userRole === 'admin' ? 'Administrator' : 'Technician'}
              </span>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <ModeToggle />

            {userRole === 'admin' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        clearSession();
                        router.push('/login');
                    }}
                    aria-label="Return to QR Scan"
                  >
                    <span className="hidden md:inline">Back to QR</span>
                    <span className="md:hidden">Back</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to Technician</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  aria-label="Logout from portal"
                >
                  <LogOut className="w-4 h-4 md:mr-2" aria-hidden="true" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </header>
  );
}
