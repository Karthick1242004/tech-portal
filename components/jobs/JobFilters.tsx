'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  const hasActiveFilters = priorityFilter !== 'all' || processFilter !== 'all';

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-border/50 shadow-md backdrop-blur-sm mb-6">
      <div className="space-y-4" role="search" aria-label="Filter and search jobs">
        {/* Search with Gradient Border */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"></div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search by equipment name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background/95 border-border/50 focus:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Search jobs by equipment name or ID"
            />
          </div>
        </div>

        {/* Filters Row with Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              Filters
              {hasActiveFilters && (
                <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></span>
              )}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Filter */}
            <div className="space-y-2 group">
              <Label htmlFor="priority-filter" className="text-xs font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></span>
                Priority
              </Label>
              <Select value={priorityFilter} onValueChange={onPriorityChange}>
                <SelectTrigger 
                  id="priority-filter" 
                  aria-label="Filter jobs by priority level"
                  className="bg-gradient-to-br from-background to-muted/30 border-border/50 hover:border-blue-300/50 transition-all duration-200 hover:shadow-sm"
                >
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
            <div className="space-y-2 group">
              <Label htmlFor="process-filter" className="text-xs font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></span>
                Process
              </Label>
              <Select value={processFilter} onValueChange={onProcessChange}>
                <SelectTrigger 
                  id="process-filter" 
                  aria-label="Filter jobs by process type"
                  className="bg-gradient-to-br from-background to-muted/30 border-border/50 hover:border-blue-300/50 transition-all duration-200 hover:shadow-sm"
                >
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
      </div>
    </Card>
  );
}
