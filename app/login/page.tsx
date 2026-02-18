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
  const { setSession } = useSessionStore();
  
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
        vendorName: authData.vendorName,
        plantId: authData.plantId,
        userRole: authData.user.role || 'technician'
      });

      // Redirect to jobs page
      router.push('/jobs');
    } catch (err: any) {
      console.error('[Login] QR login failed:', err);
      setError(err.message || 'Invalid QR code. Please try scanning again.');
      setIsLoading(false);
    }
  };

  const handleScan = (qrData: string) => {
    if (!isLoading) {
      handleQrLogin(qrData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">QR Login</h1>
            <p className="text-muted-foreground">
              Scan your QR code to access the portal
            </p>
          </div>

          {/* QR Scanner */}
          <div className="py-4">
            <QrScanner onScan={handleScan} />
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
                <AlertCircle className="h-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Admin Access */}
          <div className="pt-4 border-t">
            <Button
              onClick={() => {
                router.push('/admin/login');
              }}
              variant="outline"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Access
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
