"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const time_service_js_1 = require("./services/time-service.js");
/**
 * Horologic MCP Server
 *
 * A TypeScript implementation of a Model Context Protocol server
 * that provides time-related tools.
 */
async function main() {
    // Initialize the server
    const server = new mcp_js_1.McpServer({
        name: 'horologic-mcp',
        version: '1.0.0',
        instructions: 'Horologic MCP Server provides tools for working with time and timezones.'
    });
    // Initialize the time service
    const timeService = new time_service_js_1.TimeService();
    // Get local timezone
    const localTimezone = timeService.getLocalTimezone();
    // Register the get_current_time tool
    server.tool('get_current_time', {
        timezone: zod_1.z.string().describe(`IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use '${localTimezone}' as local timezone if no timezone provided by the user.`)
    }, async ({ timezone }) => {
        try {
            const result = timeService.getCurrentTime(timezone);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Register the convert_time tool
    server.tool('convert_time', {
        source_timezone: zod_1.z.string().describe(`Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use '${localTimezone}' as local timezone if no source timezone provided by the user.`),
        time: zod_1.z.string().describe('Time to convert in 24-hour format (HH:MM)'),
        target_timezone: zod_1.z.string().describe(`Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use '${localTimezone}' as local timezone if no target timezone provided by the user.`),
    }, async ({ source_timezone, time, target_timezone }) => {
        try {
            const result = timeService.convertTime(source_timezone, time, target_timezone);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                isError: true,
                content: [
                    {
                        type: 'text',
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
    // Set up STDIO transport
    const transport = new stdio_js_1.StdioServerTransport();
    // Connect the server to the transport
    await server.connect(transport);
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down server...');
        await server.close();
        process.exit(0);
    });
    console.log('Horologic MCP Server started');
}
// Start the server
main().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map