"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeService = void 0;
const core_1 = require("@js-joda/core");
require("@js-joda/timezone");
/**
 * Service for handling time-related operations
 */
class TimeService {
    /**
     * Get the local timezone
     * @returns The local timezone ID
     */
    getLocalTimezone() {
        try {
            // Get the system default timezone
            const systemZone = core_1.ZoneId.systemDefault();
            return systemZone.id();
        }
        catch (error) {
            // Fallback to UTC if we can't determine the local timezone
            console.error('Could not determine local timezone:', error);
            return 'UTC';
        }
    }
    /**
     * Get a ZoneId for the specified timezone
     * @param timezone The timezone name
     * @returns The ZoneId
     * @throws Error if the timezone is invalid
     */
    getZoneId(timezone) {
        try {
            return core_1.ZoneId.of(timezone);
        }
        catch (error) {
            throw new Error(`Invalid timezone: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get the current time in the specified timezone
     * @param timezone The timezone name
     * @returns The current time information
     */
    getCurrentTime(timezone) {
        const zoneId = this.getZoneId(timezone);
        const now = core_1.ZonedDateTime.now(zoneId);
        // Check if the timezone is currently in DST
        const isDst = this.isInDaylightSavings(now);
        return {
            timezone,
            datetime: now.format(core_1.DateTimeFormatter.ISO_OFFSET_DATE_TIME),
            is_dst: isDst,
        };
    }
    /**
     * Convert time between timezones
     * @param sourceTimezone The source timezone
     * @param timeStr The time string in HH:MM format
     * @param targetTimezone The target timezone
     * @returns The conversion result
     */
    convertTime(sourceTimezone, timeStr, targetTimezone) {
        // Parse the time string (HH:MM)
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
        if (!timeMatch) {
            throw new Error('Invalid time format. Expected HH:MM [24-hour format]');
        }
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error('Invalid time values. Hours must be 0-23, minutes must be 0-59');
        }
        // Get the zone IDs
        const sourceZoneId = this.getZoneId(sourceTimezone);
        const targetZoneId = this.getZoneId(targetTimezone);
        // Create a LocalTime from the parsed hours and minutes
        const localTime = core_1.LocalTime.of(hours, minutes);
        // Get the current date in the source timezone
        const sourceNow = core_1.ZonedDateTime.now(sourceZoneId);
        // Create a ZonedDateTime with the current date and the specified time in the source timezone
        const sourceTime = sourceNow
            .withHour(localTime.hour())
            .withMinute(localTime.minute())
            .withSecond(0)
            .withNano(0);
        // Convert to the target timezone
        const targetTime = sourceTime.withZoneSameInstant(targetZoneId);
        // Calculate the time difference in hours
        const sourceOffset = sourceTime.offset().totalSeconds();
        const targetOffset = targetTime.offset().totalSeconds();
        const hoursDifference = (targetOffset - sourceOffset) / 3600;
        // Format the time difference string
        let timeDiffStr;
        if (Number.isInteger(hoursDifference)) {
            timeDiffStr = `${hoursDifference >= 0 ? '+' : ''}${hoursDifference}.0h`;
        }
        else {
            // For fractional hours like Nepal's UTC+5:45
            timeDiffStr = `${hoursDifference >= 0 ? '+' : ''}${hoursDifference.toFixed(2).replace(/\.?0+$/, '')}h`;
        }
        return {
            source: {
                timezone: sourceTimezone,
                datetime: sourceTime.format(core_1.DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                is_dst: this.isInDaylightSavings(sourceTime),
            },
            target: {
                timezone: targetTimezone,
                datetime: targetTime.format(core_1.DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                is_dst: this.isInDaylightSavings(targetTime),
            },
            time_difference: timeDiffStr,
        };
    }
    /**
     * Check if a ZonedDateTime is in Daylight Saving Time
     * @param dateTime The ZonedDateTime to check
     * @returns True if in DST, false otherwise
     */
    isInDaylightSavings(dateTime) {
        try {
            // A simpler approach that doesn't rely on standardOffset
            // This is a best-effort approach since js-joda doesn't fully support DST detection
            const month = dateTime.month().value();
            // Northern hemisphere rough DST check (March-October)
            if (dateTime.zone().id().startsWith('Europe/') ||
                dateTime.zone().id().startsWith('America/') ||
                dateTime.zone().id().startsWith('Asia/')) {
                return month >= 3 && month <= 10;
            }
            // Southern hemisphere rough DST check (October-March)
            if (dateTime.zone().id().startsWith('Australia/') ||
                dateTime.zone().id().startsWith('Pacific/') ||
                dateTime.zone().id().startsWith('Antarctica/')) {
                return month >= 10 || month <= 3;
            }
            // Default to false for zones we're not sure about
            return false;
        }
        catch (error) {
            // If there's any error in DST detection, default to false
            console.warn('Error detecting DST status:', error);
            return false;
        }
    }
}
exports.TimeService = TimeService;
//# sourceMappingURL=time-service.js.map