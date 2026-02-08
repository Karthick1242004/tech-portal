import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Settings, AlertCircle } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const priorityStyles = {
    HIGH: {
      card: 'border-red-200/60 bg-gradient-to-br from-white via-red-50 to-red-50/30',
      badge: 'bg-red-100 text-red-700 border-red-300',
      dot: 'bg-red-500 shadow-lg shadow-red-500/50',
      icon: 'text-red-500'
    },
    MEDIUM: {
      card: 'border-blue-200/60 bg-gradient-to-br from-white via-blue-50 to-blue-50/30',
      badge: 'bg-blue-100 text-blue-700 border-blue-300',
      dot: 'bg-blue-500 shadow-lg shadow-blue-500/50',
      icon: 'text-blue-500'
    },
    LOW: {
      card: 'border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50 to-emerald-50/30',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      dot: 'bg-emerald-500 shadow-lg shadow-emerald-500/50',
      icon: 'text-emerald-500'
    }
  };

  const config = priorityStyles[job.priority];
  const priorityLabel = job.priority === 'MEDIUM' ? 'Medium' : job.priority === 'HIGH' ? 'High' : 'Low';

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <Card 
        className={`h-full p-4 border-2 ${config.card} hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-out animate-slideUp group active:scale-[0.99] flex flex-col`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="space-y-3">
          {/* Header: Equipment ID + Name */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-base leading-tight group-hover:text-foreground transition-colors flex-1">
              {job.equipment.id} – {job.equipment.name}
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

          {/* Process */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span>Process: {job.processFunction.description}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Planned Start */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1 border-t border-border/50">
            <Calendar className="w-4 h-4" />
            <span>Start: {job.plannedStart}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
