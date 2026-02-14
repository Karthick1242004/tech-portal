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
import { JobFilterState, INITIAL_FILTER_STATE } from '@/types/filters';
import { filterJobs } from '@/lib/filter-utils';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function JobsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isTestMode, vendorId } = useSessionStore();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // New Filter State
  const [filterState, setFilterState] = useState<JobFilterState>(INITIAL_FILTER_STATE);
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
      setDebouncedSearch(filterState.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filterState.search]);

  // Load initial jobs
  useEffect(() => {
    // if (!isAuthenticated && !isTestMode) return;

    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        // ... rest of loadJobs (unchanged logic, just context)
        const result = await getJobs(1, 10);
        
        // Debug logging for API response
        console.log('=== JOBS API RESPONSE ===');
        console.log('Total jobs:', result.total);
        console.log('Has more:', result.hasMore);
        console.log('Sample job structure:', result.jobs[0]);
        console.log('Equipment enrichment:', result.jobs[0]?.equipment);
        console.log('ProcessFunction enrichment:', result.jobs[0]?.processFunction);
        console.log('========================');
        
        setAllJobs(result.jobs);
        setTotalJobs(result.total);
        setHasNextPage(result.hasMore);
        setPage(1);
      } catch (error: any) {
        console.error('Failed to load jobs:', error);
        
        // Auth errors are now handled centrally in api.ts with auto-redirect
        // Only show toast for other errors if needed, or let the generic error state handle it
        if (error.status !== 401 && error.status !== 403) {
           toast({
             variant: "destructive", 
             title: "Error loading jobs",
             description: error.message || "Please try again later",
             className: "text-white",
           });
        }
        
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []); // Remove dependencies to avoid re-fetching on filter change (client-side filtering)

  // Filter jobs
  const filteredJobs = useMemo(() => {
    // Create effective state with debounced search
    const effectiveState = { ...filterState, search: debouncedSearch };
    return filterJobs(allJobs, effectiveState);
  }, [allJobs, filterState, debouncedSearch]);

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
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4 py-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Active Jobs</h1>
                <p className="text-sm text-muted-foreground">
                  Vendor: {vendorId || 'ACME Industrial Services'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sorted by: Planned Start → Priority
                </p>
              </div>
              <button
                onClick={() => router.push('/jobs/report')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
              >
                <span>+</span>
                <span>Report New Job</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-6">
        <div className="w-full max-w-7xl px-4">
          {/* Filters */}
          {!isLoading && !isError && (
            <JobFilters
              filterState={filterState}
              onFilterChange={setFilterState}
              onReset={() => setFilterState(INITIAL_FILTER_STATE)}
              totalJobs={totalJobs}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
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
              {/* Jobs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>

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
                      setFilterState(INITIAL_FILTER_STATE);
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
