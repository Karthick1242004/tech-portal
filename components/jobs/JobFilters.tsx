'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface JobFiltersProps {
  searchQuery: string;
  priorityFilter: string;
  processFilter: string;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onProcessChange: (value: string) => void;
}

export function JobFilters({
  searchQuery,
  priorityFilter,
  processFilter,
  onSearchChange,
  onPriorityChange,
  onProcessChange,
}: JobFiltersProps) {
  return (
    <div className="space-y-4 mb-6" role="search" aria-label="Filter and search jobs">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search by equipment name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Search jobs by equipment name or ID"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Priority Filter */}
        <div className="space-y-2">
          <Label htmlFor="priority-filter" className="text-xs font-medium">
            Priority
          </Label>
          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger id="priority-filter" aria-label="Filter jobs by priority level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Process Filter */}
        <div className="space-y-2">
          <Label htmlFor="process-filter" className="text-xs font-medium">
            Process
          </Label>
          <Select value={processFilter} onValueChange={onProcessChange}>
            <SelectTrigger id="process-filter" aria-label="Filter jobs by process type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Processes</SelectItem>
              <SelectItem value="Cooling System">Cooling System</SelectItem>
              <SelectItem value="Material Handling">Material Handling</SelectItem>
              <SelectItem value="Assembly Line">Assembly Line</SelectItem>
              <SelectItem value="Compressed Air Supply">Compressed Air Supply</SelectItem>
              <SelectItem value="Steam Generation">Steam Generation</SelectItem>
              <SelectItem value="Precision Manufacturing">Precision Manufacturing</SelectItem>
              <SelectItem value="HVAC System">HVAC System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
