'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorCardProps {
  onRetry?: () => void;
  supportEmail?: string;
}

export function ErrorCard({ 
  onRetry, 
  supportEmail = 'karthick1242004@gmail.com' 
}: ErrorCardProps) {
  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      <div className="space-y-6 text-center">
        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight text-orange-800 dark:text-orange-400">
          Something went wrong
        </h1>

        {/* Alert Icon */}
        <div className="flex justify-center py-6">
          <div className="rounded-full bg-orange-100 dark:bg-orange-950 p-6">
            <AlertTriangle className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-sm text-foreground/80 leading-relaxed">
            We couldn't load your data at the moment.
          </p>
          <p className="text-xs text-muted-foreground">
            Please check your connection or try again.
          </p>
        </div>

        {/* Retry Button */}
        <Button 
          onClick={onRetry} 
          className="w-full bg-orange-700 hover:bg-orange-800 text-white" 
          size="lg"
        >
          Retry
        </Button>

        {/* Support Contact */}
        <p className="text-xs text-muted-foreground pt-2">
          If the problem persists, contact support:{' '}
          <a 
            href={`mailto:${supportEmail}`}
            className="text-primary hover:underline"
          >
            {supportEmail}
          </a>
        </p>
      </div>
    </Card>
  );
}
