'use client';

import { useSessionStore } from '@/store/session.store';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function AppHeader() {
  const { isAuthenticated, vendorId, userRole, clearSession } = useSessionStore();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">
            {userRole === 'admin' ? 'Admin Portal' : 'Technician Portal'}
          </h1>
          {isAuthenticated && (
            <span className="text-xs text-muted-foreground" role="status" aria-label="Current vendor">
              {vendorId || 'ACME Industrial Services'} • {userRole === 'admin' ? 'Administrator' : 'Technician'}
            </span>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            {userRole === 'technician' && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin')}
                aria-label="Access admin interface"
              >
                <LayoutGrid className="w-4 h-4 mr-2" aria-hidden="true" />
                Admin Access
              </Button>
            )}
            {userRole === 'admin' && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => router.push('/jobs')}
                aria-label="Return to technician portal"
              >
                Return to Technician
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              aria-label="Logout from portal"
            >
              <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
