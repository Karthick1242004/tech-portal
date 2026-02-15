'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrScanner } from '@/components/qr/QrScanner';
import { useSessionStore } from '@/store/session.store';
import { apiClient, loginWithQr } from '@/lib/api';
import { Loader2, Shield, AlertCircle, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, setTestMode, isTestMode } = useSessionStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      handleQrLogin(token);
    }
  }, [searchParams]);

  const handleQrLogin = async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use centralized API function
      const authData = await loginWithQr(token);

      // Store session in Zustand
      setSession({
        accessToken: authData.accessToken,
        vendorId: authData.vendorId,
        plantId: authData.plantId,
        userRole: authData.user.role || 'technician'
      });

      // Redirect to jobs page
      router.push('/jobs');
    } catch (err: any) {
      console.error('[Header] Login failed:', err);
      setError(err.message || 'Invalid QR code. Please try scanning again.');
      setIsLoading(false);
    }
  };

  const handleSimulateScan = () => {
      // Simulate scanning a valid QR code: VENDOR:PLANT:USER
      handleQrLogin("ACME:Plant1:Tech001");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">QR Login</h1>
            <p className="text-muted-foreground">
              Scan your QR code at reception
            </p>
          </div>

          {/* QR Scanner */}
          <div className="py-4 relative group">
            <QrScanner 
                onScan={(token) => handleQrLogin(token)}
                onError={(err) => console.error(err)}
            />
            {/* Dev Helper - Keep simulated scan for easier testing without camera */}
             <div 
                className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1 rounded-full z-20"
                onClick={handleSimulateScan}
                title="Simulate Scan (Dev)"
             >
                 <ScanLine className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>

          {/* Instruction */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">
              Align the QR code within the frame
            </p>
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Validating access...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Dev Tools */}
          <div className="space-y-2 pt-4 border-t">
            <Button
                onClick={handleSimulateScan}
                className="w-full bg-blue-600 hover:bg-blue-700"
            >
                <ScanLine className="w-4 h-4 mr-2" />
                Simulate Scan (Dev)
            </Button>
            
            {/* Optional: Keep test mode for fallback if needed, but 'Simulate Scan' is better */}
            <Button
              onClick={() => {
                router.push('/admin/login');
              }}
              variant="outline"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Access (Login)
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t">
            <Shield className="w-4 h-4" />
            <span>Secure access powered by EAM</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
