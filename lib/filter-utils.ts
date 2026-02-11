import { Job } from './mock-jobs';
import { JobFilterState } from '../types/filters';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export function filterJobs(jobs: Job[], state: JobFilterState): Job[] {
    return jobs.filter(job => {
        // 1. Search Filter
        if (state.search) {
            const searchLower = state.search.toLowerCase();
            const matchesSearch =
                job.id.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower) ||
                job.equipment.name.toLowerCase().includes(searchLower) ||
                job.processFunction.description.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;
        }

        // 2. Priority Filter
        if (state.priorities.length > 0) {
            if (!state.priorities.includes(job.priority)) {
                return false;
            }
        }

        // 3. Date Range Filter
        if (state.dateRange?.from) {
            const dateToCheckStr = state.dateType === 'plannedStart' ? job.plannedStart : job.targetEnd;
            if (!dateToCheckStr) return false;

            const dateToCheck = parseISO(dateToCheckStr);
            const rangeStart = startOfDay(state.dateRange.from);
            const rangeEnd = state.dateRange.to ? endOfDay(state.dateRange.to) : endOfDay(state.dateRange.from);

            if (!isWithinInterval(dateToCheck, { start: rangeStart, end: rangeEnd })) {
                return false;
            }
        }

        return true;
    });
}
