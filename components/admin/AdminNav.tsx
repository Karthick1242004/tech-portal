'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare, QrCode, Users } from 'lucide-react';

const adminLinks = [
  {
    href: '/admin/feedback',
    label: 'Feedback Manager',
    icon: MessageSquare,
    description: 'Review technician feedback and reports',
  },
  {
    href: '/admin/qr',
    label: 'QR Code Generator',
    icon: QrCode,
    description: 'Generate QR codes for job access',
  },
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
    description: 'Manage admin accounts and access',
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Admin navigation">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Icon className="w-5 h-5 mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
              <div className="font-medium text-sm">{link.label}</div>
              <div className={cn(
                'text-xs',
                isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                {link.description}
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
