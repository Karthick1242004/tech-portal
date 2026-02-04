import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function JobInfoSkeleton() {
  return (
    <div className="space-y-4">
      {/* Job ID Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-32" />
      </Card>

      {/* Process Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-5 w-48" />
      </Card>

      {/* Description Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </Card>

      {/* Priority Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-24" />
      </Card>

      {/* Dates Card */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </Card>

      {/* Contact Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40 mt-2" />
      </Card>
    </div>
  );
}
