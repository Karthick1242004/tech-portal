/**
 * Payload for editing an existing job.
 * Only the fields the technician is allowed to modify.
 */
export interface EditJobPayload {
    description: string;
    scheduledStartDate: string; // ISO 8601 datetime string (from datetime-local input)
    targetDate: string;         // ISO 8601 datetime string
    reportText: string;
    text: string;
}
