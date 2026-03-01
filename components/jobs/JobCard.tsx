'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Pencil } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const router = useRouter();

  const priorityStyles = {
    HIGH: {
      card: 'border-red-200/60 dark:border-red-500/20 bg-gradient-to-br from-white via-red-50 to-red-50/30 dark:from-slate-950/60 dark:via-red-950/10 dark:to-red-900/5',
      badge: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',
      dot: 'bg-red-500 shadow-lg shadow-red-500/50',
      icon: 'text-red-500 dark:text-red-400',
      editBtn: 'text-red-600 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-950/50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/50',
    },
    MEDIUM: {
      card: 'border-blue-200/60 dark:border-blue-500/20 bg-gradient-to-br from-white via-blue-50 to-blue-50/30 dark:from-slate-950/60 dark:via-blue-950/10 dark:to-blue-900/5',
      badge: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900',
      dot: 'bg-blue-500 shadow-lg shadow-blue-500/50',
      icon: 'text-blue-500 dark:text-blue-400',
      editBtn: 'text-blue-600 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900/50',
    },
    LOW: {
      card: 'border-emerald-200/60 dark:border-emerald-500/20 bg-gradient-to-br from-white via-emerald-50 to-emerald-50/30 dark:from-slate-950/60 dark:via-emerald-950/10 dark:to-emerald-900/5',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
      dot: 'bg-emerald-500 shadow-lg shadow-emerald-500/50',
      icon: 'text-emerald-500 dark:text-emerald-400',
      editBtn: 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900/50',
    }
  };

  const config = priorityStyles[job.priority];
  const priorityLabel = job.priority === 'MEDIUM' ? 'Medium' : job.priority === 'HIGH' ? 'High' : 'Low';

  return (
    // Outer div handles card navigation; pencil icon stops propagation
    <div
      className="block h-full cursor-pointer"
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      <Card
        className={`h-full p-4 border-2 ${config.card} backdrop-blur-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-out animate-slideUp group active:scale-[0.99] flex flex-col`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-base leading-tight group-hover:text-foreground transition-colors flex-1">
              {job.id} – {job.description}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className={`text-xs font-medium ${config.badge} border transition-all duration-200`}
              >
                <AlertCircle className={`w-3 h-3 mr-1 ${config.icon}`} />
                {priorityLabel}
              </Badge>
              <div className={`w-3 h-3 rounded-full ${config.dot} animate-pulse`} />
            </div>
          </div>

          <div
            className="text-sm text-foreground/80 line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.reportText || job.description }}
          />
          <div className="text-xs text-muted-foreground pt-3 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0 pr-2">
              <span>{new Date(job.plannedStart).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}</span>
              <span>•</span>
              <span className={job.status.toLowerCase() === 'in progress' ? 'text-emerald-600 font-semibold dark:text-emerald-400' : 'font-medium'}>
                {job.status}
              </span>
              <span className={`${job.processFunction.description === 'Unknown' ? 'hidden' : ''}`}>•</span>
              <span className={`truncate max-w-[120px] ${job.processFunction.description === 'Unknown' ? 'hidden' : ''}`}>{job.processFunction.description}</span>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/jobs/${job.id}/edit`);
              }}
              className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${config.editBtn}`}
              aria-label={`Edit job ${job.id}`}
              title="Edit job"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
