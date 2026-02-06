'use client';

import { useState, useMemo, useEffect } from 'react';
import { FeedbackCard } from '@/components/admin/FeedbackCard';
import { FeedbackFilters } from '@/components/admin/FeedbackFilters';
import { EmptyState } from '@/components/system/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function AdminFeedbackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minHours, setMinHours] = useState('all');
  const [hasImages, setHasImages] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [feedbacks, setFeedbacks] = useState<any[]>([]); // Using any for now to match backend shape

  // Fetch real feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<{ success: boolean; data: any[] }>('/feedback/all');
        if (response.success) {
          setFeedbacks(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    return feedbacks.filter((feedback) => {
      // Search filter
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesSearch =
          (feedback.jobId || '').toLowerCase().includes(query) ||
          (feedback.equipmentName || '').toLowerCase().includes(query) ||
          (feedback.technicianName || '').toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Min hours filter
      if (minHours !== 'all') {
        if (feedback.hoursWorked < Number.parseInt(minHours)) return false;
      }

      // Has images filter
      if (hasImages === 'yes' && (!feedback.images || feedback.images.length === 0)) return false;
      if (hasImages === 'no' && feedback.images && feedback.images.length > 0) return false;

      return true;
    });
  }, [debouncedSearch, minHours, hasImages, feedbacks]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Technician Feedback
          </h1>
          <p className="text-muted-foreground">
            View and analyze feedback from field technicians
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FeedbackFilters
            searchQuery={searchQuery}
            minHours={minHours}
            hasImages={hasImages}
            onSearchChange={setSearchQuery}
            onMinHoursChange={setMinHours}
            onHasImagesChange={setHasImages}
          />
        </div>

        {/* Results Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredFeedback.length} of {feedbacks.length} feedback entries
          </p>
        )}

        {/* Feedback List */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))
          ) : filteredFeedback.length > 0 ? (
            filteredFeedback.map((feedback, index) => (
              <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
            ))
          ) : feedbacks.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No feedback available yet"
              description="Feedback from technicians will appear here once they submit their work reports."
            />
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No feedback found"
              description="Try adjusting your filters or search keywords to find more feedback entries."
              action={{
                label: 'Clear Filters',
                onClick: () => {
                  setSearchQuery('');
                  setMinHours('all');
                  setHasImages('all');
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
