import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Settings } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const priorityConfig = {
    HIGH: { variant: 'destructive' as const, color: 'bg-red-500' },
    MEDIUM: { variant: 'default' as const, color: 'bg-yellow-500' },
    LOW: { variant: 'secondary' as const, color: 'bg-green-500' },
  };

  const config = priorityConfig[job.priority];

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary/50 active:scale-[0.99]">
        <div className="space-y-3">
          {/* Header: Equipment ID + Name */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-base leading-tight">
              {job.equipment.id} – {job.equipment.name}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                variant={config.variant}
                className="text-xs font-medium"
              >
                {job.priority === 'MEDIUM' ? 'Medium' : job.priority === 'HIGH' ? 'High' : 'Low'}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
            </div>
          </div>

          {/* Process */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span>Process: {job.processFunction.description}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80 line-clamp-2">
            {job.description}
          </p>

          {/* Planned Start */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <Calendar className="w-4 h-4" />
            <span>Start: {job.plannedStart}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
