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
    <div className="grid gap-6 py-4">
      {/* Priority Filter */}
      <div className="space-y-4">
        <h4 className="font-medium leading-none">Priority</h4>
        <div className="grid gap-3">
          {['HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <div key={p} className="flex items-center space-x-2">
              <Checkbox 
                id={`priority-${p}`} 
                checked={localState.priorities.includes(p as Priority)}
                onCheckedChange={(checked) => handlePriorityChange(p as Priority, checked as boolean)}
              />
              <Label htmlFor={`priority-${p}`} className="capitalize">{p.toLowerCase()}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />

      {/* Date Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium leading-none">Date Range</h4>
          <RadioGroup 
            value={localState.dateType} 
            onValueChange={(v) => setLocalState(prev => ({ ...prev, dateType: v as 'plannedStart' | 'targetEnd' }))}
            className="flex items-center gap-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="plannedStart" id="r1" />
              <Label htmlFor="r1" className="text-xs">Planned</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="targetEnd" id="r2" />
              <Label htmlFor="r2" className="text-xs">Target</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid gap-2">
          <Calendar
            mode="range"
            selected={localState.dateRange}
            onSelect={(range) => setLocalState(prev => ({ ...prev, dateRange: range ? { from: range.from, to: range.to } : undefined }))}
            className="rounded-md border"
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
          <SheetHeader>
            <SheetTitle>Filter Jobs</SheetTitle>
            <SheetDescription>
              Narrow down the job list using the filters below.
            </SheetDescription>
          </SheetHeader>
          
          {FilterContent}
          
          <SheetFooter className="gap-2 sm:space-x-0">
             <Button variant="outline" onClick={() => { onReset(); setLocalState({ ...filterState, priorities: [], dateRange: undefined }); setOpen(false); }}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
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
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter Jobs</DrawerTitle>
          <DrawerDescription>
            Narrow down the job list using the filters below.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 overflow-y-auto max-h-[60vh]">
            {FilterContent}
        </div>
        
        <DrawerFooter className="pt-2">
          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="outline" onClick={() => { onReset(); setOpen(false); }}>Reset</Button>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
