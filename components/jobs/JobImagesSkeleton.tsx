import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function JobImagesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="aspect-[4/3] overflow-hidden"
          >
            <Skeleton className="w-full h-full" />
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-4 w-full" />
    </div>
  );
}
