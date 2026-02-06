'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeedbackFiltersProps {
  searchQuery: string;
  minHours: string;
  hasImages: string;
  onSearchChange: (value: string) => void;
  onMinHoursChange: (value: string) => void;
  onHasImagesChange: (value: string) => void;
}

export function FeedbackFilters({
  searchQuery,
  minHours,
  hasImages,
  onSearchChange,
  onMinHoursChange,
  onHasImagesChange,
}: FeedbackFiltersProps) {
  const hasActiveFilters = minHours !== 'all' || hasImages !== 'all';

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-background to-muted/20 border-2 border-border/50 shadow-md backdrop-blur-sm">
      <div className="space-y-4">
        {/* Search with Gradient Border */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300"></div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search by job ID, equipment, or technician..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background/95 border-border/50 focus:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
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
            {/* Min Hours Worked */}
            <div className="space-y-2 group">
              <Label htmlFor="min-hours" className="text-xs font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></span>
                Min Hours Worked
              </Label>
              <Select value={minHours} onValueChange={onMinHoursChange}>
                <SelectTrigger 
                  id="min-hours"
                  className="bg-gradient-to-br from-background to-muted/30 border-border/50 hover:border-blue-300/50 transition-all duration-200 hover:shadow-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="2">2+ hours</SelectItem>
                  <SelectItem value="4">4+ hours</SelectItem>
                  <SelectItem value="6">6+ hours</SelectItem>
                  <SelectItem value="8">8+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Has Images */}
            <div className="space-y-2 group">
              <Label htmlFor="has-images" className="text-xs font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></span>
                Images
              </Label>
              <Select value={hasImages} onValueChange={onHasImagesChange}>
                <SelectTrigger 
                  id="has-images"
                  className="bg-gradient-to-br from-background to-muted/30 border-border/50 hover:border-blue-300/50 transition-all duration-200 hover:shadow-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">With images</SelectItem>
                  <SelectItem value="no">Without images</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
