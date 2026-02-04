'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[v0] Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={reset} 
            className="w-full"
            aria-label="Retry loading the page"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Need help? Contact{' '}
            <a 
              href="mailto:karthick1242004@gmail.com" 
              className="text-primary hover:underline"
            >
              karthick1242004@gmail.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
