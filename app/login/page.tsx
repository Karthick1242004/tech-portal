'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrScanner } from '@/components/qr/QrScanner';
import { useSessionStore } from '@/store/session.store';
import { apiClient } from '@/lib/api';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, setTestMode, isTestMode } = useSessionStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    // if (token) {
    //   handleQrLogin(token);
    // }
  }, [searchParams]);

  // const handleQrLogin = async (token: string) => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const response = await apiClient.post<{
  //       accessToken: string;
  //       vendorId: string;
  //       plantId: string;
  //     }>('/auth/qr-login', { token });

  //     // Store session in Zustand
  //     setSession({
  //       accessToken: response.accessToken,
  //       vendorId: response.vendorId,
  //       plantId: response.plantId,
  //     });

  //     // Redirect to jobs page
  //     router.push('/jobs');
  //   } catch (err) {
  //     console.error('[v0] Login failed:', err);
  //     setError('Invalid QR code. Please try scanning again.');
  //     setIsLoading(false);
  //   }
  // };

  const handleTestDemo = () => {
    setTestMode(true);
    router.push('/jobs');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
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
          <div className="py-4">
            <QrScanner />
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

          {/* Test Demo Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleTestDemo}
              className="w-full"
              variant={isTestMode ? "default" : "outline"}
            >
              {isTestMode ? 'Test Mode Active' : 'Test Demo Data'}
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
