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
    <div className="flex w-full items-center gap-3 mb-6">
       {/* Search Bar - Compact & Rounded */}
       <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            type="search"
            placeholder="Search by equipment name or ID..."
            value={filterState.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-full border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all hover:bg-white hover:shadow-md dark:bg-slate-900/50 dark:border-slate-800"
            aria-label="Search jobs"
          />
       </div>

       {/* Filter Button */}
       <JobFilter 
         filterState={filterState} 
         onFilterChange={onFilterChange} 
         onReset={onReset}
         totalJobs={totalJobs}
       />
    </div>
  );
}
