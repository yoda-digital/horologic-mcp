import '@js-joda/timezone';
/**
 * Interface for time result
 */
export interface TimeResult {
    timezone: string;
    datetime: string;
    is_dst: boolean;
}
/**
 * Interface for time conversion result
 */
export interface TimeConversionResult {
    source: TimeResult;
    target: TimeResult;
    time_difference: string;
}
/**
 * Service for handling time-related operations
 */
export declare class TimeService {
    /**
     * Get the local timezone
     * @returns The local timezone ID
     */
    getLocalTimezone(): string;
    /**
     * Get a ZoneId for the specified timezone
     * @param timezone The timezone name
     * @returns The ZoneId
     * @throws Error if the timezone is invalid
     */
    private getZoneId;
    /**
     * Get the current time in the specified timezone
     * @param timezone The timezone name
     * @returns The current time information
     */
    getCurrentTime(timezone: string): TimeResult;
    /**
     * Convert time between timezones
     * @param sourceTimezone The source timezone
     * @param timeStr The time string in HH:MM format
     * @param targetTimezone The target timezone
     * @returns The conversion result
     */
    convertTime(sourceTimezone: string, timeStr: string, targetTimezone: string): TimeConversionResult;
    /**
     * Check if a ZonedDateTime is in Daylight Saving Time
     * @param dateTime The ZonedDateTime to check
     * @returns True if in DST, false otherwise
     */
    private isInDaylightSavings;
}
