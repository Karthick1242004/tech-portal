import { Card } from '@/components/ui/card';

export function JobSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="space-y-3">
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="w-2 h-2 rounded-full bg-muted" />
          </div>
        </div>

        {/* Process skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>

        {/* Date skeleton */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-4 h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-2/5" />
        </div>
      </div>
    </Card>
  );
}
