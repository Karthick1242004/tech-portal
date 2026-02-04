import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export function SessionEndedCard() {
  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      <div className="space-y-6 text-center">
        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight">Session Ended</h1>

        {/* Lock Icon */}
        <div className="flex justify-center py-6">
          <div className="rounded-full bg-muted p-6">
            <Lock className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-sm text-foreground/80 leading-relaxed">
            You have been logged out because a new session was started on another device.
          </p>
        </div>

        {/* Button */}
        <Button asChild className="w-full" size="lg">
          <Link href="/login">Scan QR to Login Again</Link>
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-muted-foreground pt-2">
          For security reasons, only one active session is allowed.
        </p>
      </div>
    </Card>
  );
}
