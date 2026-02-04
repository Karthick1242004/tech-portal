import { QrGenerator } from '@/components/admin/QrGenerator';

export default function AdminQrPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <QrGenerator />
    </div>
  );
}
