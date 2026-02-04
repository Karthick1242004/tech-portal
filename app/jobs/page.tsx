'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/session.store';
import { getJobs } from '@/lib/api';
import { JobCard } from '@/components/jobs/JobCard';
import { JobSkeleton } from '@/components/jobs/JobSkeleton';
import { JobFilters } from '@/components/jobs/JobFilters';
import { EmptyState } from '@/components/system/EmptyState';
import { Loader2, Briefcase } from 'lucide-react';
import type { Job } from '@/lib/mock-jobs';

export default function JobsPage() {
  const router = useRouter();
  const { isAuthenticated, isTestMode, vendorId } = useSessionStore();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [processFilter, setProcessFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auth check - commented out to allow test mode
    // if (!isAuthenticated && !isTestMode) {
    //   router.push('/login');
    // }
  }, [isAuthenticated, isTestMode, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load initial jobs
  useEffect(() => {
    // if (!isAuthenticated && !isTestMode) return;

    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getJobs(1, 10);
        setAllJobs(result.jobs);
        setTotalJobs(result.total);
        setHasNextPage(result.hasMore);
        setPage(1);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Search filter
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesSearch =
          job.equipment.name.toLowerCase().includes(query) ||
          job.equipment.id.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && job.priority !== priorityFilter) {
        return false;
      }

      // Process filter
      if (processFilter !== 'all' && job.processFunction.description !== processFilter) {
        return false;
      }

      return true;
    });
  }, [allJobs, debouncedSearch, priorityFilter, processFilter]);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;

    try {
      setIsFetchingNextPage(true);
      const nextPage = page + 1;
      const result = await getJobs(nextPage, 10);
      setAllJobs((prev) => [...prev, ...result.jobs]);
      setHasNextPage(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more jobs:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [page, isFetchingNextPage, hasNextPage]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (!isAuthenticated && !isTestMode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4 py-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Active Jobs</h1>
              <p className="text-sm text-muted-foreground">
                Vendor: {vendorId || 'ACME Industrial Services'}
              </p>
              <p className="text-xs text-muted-foreground">
                Sorted by: Planned Start → Priority
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-6">
        <div className="w-full max-w-2xl px-4">
          {/* Filters */}
          {!isLoading && !isError && (
            <JobFilters
              searchQuery={searchQuery}
              priorityFilter={priorityFilter}
              processFilter={processFilter}
              onSearchChange={setSearchQuery}
              onPriorityChange={setPriorityFilter}
              onProcessChange={setProcessFilter}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <JobSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <p className="text-destructive font-medium">Failed to load jobs</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please try again later
              </p>
            </div>
          )}

          {/* Results Count */}
          {!isLoading && !isError && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredJobs.length} of {totalJobs} jobs
            </p>
          )}

          {/* Jobs List */}
          {!isLoading && !isError && (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* Intersection Observer Target */}
              <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading more jobs...</span>
                  </div>
                )}
                
                {!hasNextPage && filteredJobs.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    All {totalJobs} jobs loaded
                  </p>
                )}
              </div>

              {/* Empty State */}
              {filteredJobs.length === 0 && (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs found"
                  description="Try adjusting your filters or search keywords to find more jobs."
                  action={{
                    label: 'Clear Filters',
                    onClick: () => {
                      setSearchQuery('');
                      setPriorityFilter('all');
                      setProcessFilter('all');
                    },
                  }}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
