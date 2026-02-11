'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { JobFilter } from './JobFilter';
import { JobFilterState } from '@/types/filters';

interface JobFiltersProps {
  filterState: JobFilterState;
  onFilterChange: (newState: JobFilterState) => void;
  onReset: () => void;
  totalJobs: number;
}

export function JobFilters({
  filterState,
  onFilterChange,
  onReset,
  totalJobs,
}: JobFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filterState, search: value });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-border/50 shadow-md backdrop-blur-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between" role="search" aria-label="Filter and search jobs">
        {/* Search with Gradient Border */}
        <div className="relative group w-full md:w-auto md:flex-1 max-w-md">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"></div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search by equipment name or ID..."
              value={filterState.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-background/95 border-border/50 focus:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md h-9"
              aria-label="Search jobs by equipment name or ID"
            />
          </div>
        </div>

        {/* Filter Button */}
        <div className="w-full md:w-auto flex justify-end">
          <JobFilter 
            filterState={filterState} 
            onFilterChange={onFilterChange} 
            onReset={onReset}
            totalJobs={totalJobs}
          />
        </div>
      </div>
    </Card>
  );
}
