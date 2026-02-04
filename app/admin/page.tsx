'use client';

import { useSessionStore } from '@/store/session.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, userRole, setUserRole } = useSessionStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleAccessAdmin = () => {
    setUserRole('admin');
  };

  // Show role switcher for testing if in test mode
  if (userRole === 'technician') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You are currently logged in as a technician. Click below to switch to admin mode for management tasks.
          </p>
          
          <Button 
            onClick={handleAccessAdmin}
            className="w-full"
            aria-label="Switch to admin interface"
          >
            Enter Admin Interface
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-center py-8">
        <div className="w-full max-w-4xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage feedback, generate access codes, and oversee system operations
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <AdminNav />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="text-3xl font-bold mb-1">35</div>
              <p className="text-sm text-muted-foreground">Feedback Entries</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold mb-1">50</div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold mb-1">2</div>
              <p className="text-sm text-muted-foreground">Plants Managed</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
