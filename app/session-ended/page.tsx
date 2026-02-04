import { SessionEndedCard } from '@/components/system/SessionEndedCard';

export default function SessionEndedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <SessionEndedCard />
    </div>
  );
}
