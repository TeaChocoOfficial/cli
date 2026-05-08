//-Path: "cli/src/class/time.ts"
import dayjs from "dayjs";

/**
 * Utility class for time operations
 */
export abstract class Time {
    /**
     * Get time difference as human-readable string
     * @param timestamp - Timestamp to compare (defaults to now)
     * @returns Time difference string
     */
    static left(timestamp?: number): string {
        const now = new Date().getTime();
        const timeDifference = now - (timestamp ?? new Date().getTime());

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 30) {
            return "morethen";
        } else if (days > 0) {
            return `${days} days`;
        } else if (hours > 0) {
            return `${hours} hours`;
        } else if (minutes > 0) {
            return `${minutes} minutes`;
        } else if (seconds > 0) {
            return `${seconds} seconds`;
        }
        return "";
    }
    /**
     * Format timestamp to date string
     * @param timestamp - Timestamp to format (defaults to now)
     * @returns Formatted date string
     */
    static date(timestamp?: number): string {
        let date = new Date();
        if (timestamp) date = new Date(timestamp);
        return dayjs(date).format("HH:mm:ss DD/MM/YYYY");
    }
    /**
     * Check if timestamp is in the past or now
     * @param timestamp - Timestamp to check (defaults to now)
     * @returns True if timestamp is in the past or now
     */
    static afterDate(timestamp?: number): boolean {
        let date = new Date().getTime();
        if (timestamp) date = new Date(timestamp).getTime();
        return date <= new Date().getTime();
    }
}
