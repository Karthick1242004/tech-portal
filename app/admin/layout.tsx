'use client';

import React from "react"

import { useSessionStore } from '@/store/session.store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { EmptyState } from '@/components/system/EmptyState';
import { ShieldX } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userRole } = useSessionStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to /admin/login without authentication
    if (pathname === '/admin/login') {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router, pathname]);

  // Allow rendering of login page without authentication
  if (pathname === '/admin/login') {
    return children;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Admin pages are accessible to both admin and technician roles
  // Technicians see a gate page at /admin with option to enter admin mode
  // For specific admin pages, they have direct access after entering admin mode
  return children;
}
