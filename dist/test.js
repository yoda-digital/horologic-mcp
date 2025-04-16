"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_service_1 = require("./services/time-service");
/**
 * Simple test script for the TimeService
 */
async function main() {
    console.log('Testing TimeService...');
    const timeService = new time_service_1.TimeService();
    // Test getting local timezone
    const localTimezone = timeService.getLocalTimezone();
    console.log(`Local timezone: ${localTimezone}`);
    // Test getting current time
    try {
        const currentTime = timeService.getCurrentTime(localTimezone);
        console.log('Current time:');
        console.log(JSON.stringify(currentTime, null, 2));
    }
    catch (error) {
        console.error('Error getting current time:', error);
    }
    // Test getting current time in a different timezone
    try {
        const newYorkTime = timeService.getCurrentTime('America/New_York');
        console.log('Current time in New York:');
        console.log(JSON.stringify(newYorkTime, null, 2));
    }
    catch (error) {
        console.error('Error getting New York time:', error);
    }
    // Test time conversion
    try {
        const conversion = timeService.convertTime(localTimezone, '14:30', 'America/Los_Angeles');
        console.log('Time conversion:');
        console.log(JSON.stringify(conversion, null, 2));
    }
    catch (error) {
        console.error('Error converting time:', error);
    }
    // Test error handling with invalid timezone
    try {
        const invalidTime = timeService.getCurrentTime('Invalid/Timezone');
        console.log(invalidTime); // Should not reach here
    }
    catch (error) {
        console.log('Expected error with invalid timezone:');
        console.log(error instanceof Error ? error.message : String(error));
    }
    // Test error handling with invalid time format
    try {
        const invalidConversion = timeService.convertTime(localTimezone, 'not-a-time', 'America/Los_Angeles');
        console.log(invalidConversion); // Should not reach here
    }
    catch (error) {
        console.log('Expected error with invalid time format:');
        console.log(error instanceof Error ? error.message : String(error));
    }
}
// Run the tests
main().catch(error => {
    console.error('Test failed:', error);
});
//# sourceMappingURL=test.js.map