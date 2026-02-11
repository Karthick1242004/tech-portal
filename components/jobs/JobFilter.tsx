"use client"

import * as React from "react"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query" // Need to check if this exists or create it
import { JobFilterState, Priority } from "@/types/filters"

interface JobFilterProps {
  filterState: JobFilterState;
  onFilterChange: (newState: JobFilterState) => void;
  onReset: () => void;
  totalJobs?: number;
}

export function JobFilter({ filterState, onFilterChange, onReset, totalJobs }: JobFilterProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Local state for the form, committed on apply
  const [localState, setLocalState] = React.useState<JobFilterState>(filterState)

  React.useEffect(() => {
    if (open) {
      setLocalState(filterState)
    }
  }, [open, filterState])

  const handlePriorityChange = (priority: Priority, checked: boolean) => {
    setLocalState(prev => {
      const newPriorities = checked 
        ? [...prev.priorities, priority]
        : prev.priorities.filter(p => p !== priority)
      return { ...prev, priorities: newPriorities }
    })
  }

  const handleApply = () => {
    onFilterChange(localState)
    setOpen(false)
  }

  const activeFilterCount = 
    localState.priorities.length + 
    (localState.dateRange?.from ? 1 : 0);

  const FilterContent = (
    <div className="grid gap-8 py-6">
      {/* Priority Filter */}
      <div className="space-y-4">
        <h4 className="font-semibold text-base text-foreground/90">Priority</h4>
        <div className="grid gap-3.5">
          {['HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <div key={p} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handlePriorityChange(p as Priority, !localState.priorities.includes(p as Priority))}>
              <Checkbox 
                id={`priority-${p}`} 
                checked={localState.priorities.includes(p as Priority)}
                onCheckedChange={(checked) => handlePriorityChange(p as Priority, checked as boolean)}
                className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`priority-${p}`} className="capitalize text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
                {p.toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="bg-slate-100" />

      {/* Date Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base text-foreground/90">Date Range</h4>
          <div className="bg-slate-100 p-1 rounded-lg">
            <RadioGroup 
              value={localState.dateType} 
              onValueChange={(v) => setLocalState(prev => ({ ...prev, dateType: v as 'plannedStart' | 'targetEnd' }))}
              className="flex items-center gap-0"
            >
              <div className="flex items-center">
                <RadioGroupItem value="plannedStart" id="r1" className="sr-only" />
                <Label 
                  htmlFor="r1" 
                  className={cn(
                    "cursor-pointer px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    localState.dateType === 'plannedStart' 
                      ? "bg-white dark:bg-slate-700 text-primary dark:text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Planned
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="targetEnd" id="r2" className="sr-only" />
                <Label 
                  htmlFor="r2" 
                  className={cn(
                    "cursor-pointer px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    localState.dateType === 'targetEnd' 
                      ? "bg-white dark:bg-slate-700 text-primary dark:text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Target
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="border rounded-xl p-1 bg-white dark:bg-card shadow-sm overflow-hidden">
          <Calendar
            mode="range"
            selected={localState.dateRange}
            onSelect={(range) => setLocalState(prev => ({ ...prev, dateRange: range ? { from: range.from, to: range.to } : undefined }))}
            className="rounded-lg w-full"
            classNames={{
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
              day_today: "bg-slate-100 text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="space-y-2 pb-4 border-b">
            <SheetTitle className="text-center text-xl font-bold">Filter Jobs</SheetTitle>
            <SheetDescription className="text-center text-sm text-muted-foreground">
              Narrow down the job list using the filters below.
            </SheetDescription>
          </SheetHeader>
          
          <div className="px-1">
            {FilterContent}
          </div>
          
          <SheetFooter className="flex-col gap-3 sm:space-x-0 pt-4 border-t mt-auto">
            <Button onClick={handleApply} className="w-full h-12 rounded-xl text-base font-semibold shadow-md active:scale-[0.98] transition-all">
              Apply Filters
            </Button>
             <Button variant="outline" onClick={() => { onReset(); setLocalState({ ...filterState, priorities: [], dateRange: undefined }); setOpen(false); }} className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600">
              Reset
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          Filter
           {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-2" />
        <DrawerHeader className="text-center pt-2 pb-4 border-b">
          <DrawerTitle className="text-xl font-bold">Filter Jobs</DrawerTitle>
          <DrawerDescription>
            Narrow down the job list using the filters below.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-6 overflow-y-auto">
            {FilterContent}
        </div>
        
        <DrawerFooter className="pt-4 border-t flex-col gap-3 pb-8 px-6">
          <Button onClick={handleApply} className="w-full h-12 rounded-xl text-base font-semibold shadow-md active:scale-[0.98] transition-all">
            Apply Filters
          </Button>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={() => { onReset(); setOpen(false); }} className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600">
              Reset
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" className="flex-1 h-12 rounded-xl text-slate-500">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
