'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by job ID, equipment, or technician..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Min Hours Worked */}
        <div className="space-y-2">
          <Label htmlFor="min-hours" className="text-xs font-medium">
            Min Hours Worked
          </Label>
          <Select value={minHours} onValueChange={onMinHoursChange}>
            <SelectTrigger id="min-hours">
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
        <div className="space-y-2">
          <Label htmlFor="has-images" className="text-xs font-medium">
            Images
          </Label>
          <Select value={hasImages} onValueChange={onHasImagesChange}>
            <SelectTrigger id="has-images">
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
  );
}
