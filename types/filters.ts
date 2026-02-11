export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DateRange {
    from: Date | undefined;
    to?: Date | undefined;
}

export interface JobFilterState {
    search: string;
    priorities: Priority[];
    dateRange: DateRange | undefined;
    dateType: 'plannedStart' | 'targetEnd';
}

export const INITIAL_FILTER_STATE: JobFilterState = {
    search: '',
    priorities: [],
    dateRange: undefined,
    dateType: 'plannedStart',
};
