import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function JobFeedbackSkeleton() {
  return (
    <div className="space-y-4">
      {/* Feedback Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-24 w-full" />
      </Card>

      {/* Hours Worked Card */}
      <Card className="p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-10 w-full" />
      </Card>

      {/* Submit Button */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
