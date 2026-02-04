import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container py-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </header>

      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-4 py-6 space-y-6">
          {/* Title Skeleton */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-2 border-b">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Content Cards Skeleton */}
          <div className="space-y-4">
            <Card className="p-4">
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </Card>

            <Card className="p-4">
              <Skeleton className="h-5 w-40 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-2" />
            </Card>

            <Card className="p-4">
              <Skeleton className="h-5 w-36 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
