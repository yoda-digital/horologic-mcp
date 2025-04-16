<p align="center"><img src="../assets/horologic-logo.png" width="200" alt="Horologic MCP Logo"></p>

# Horologic MCP Documentation

**TypeScript Model Context Protocol (MCP) Time Server by Yoda Digital**

---

## Overview

Horologic MCP is a reliable Model Context Protocol (MCP) server for time and timezone operations, built with TypeScript. It provides seamless integration with Claude Desktop and other MCP-compatible clients, offering the same functionality as the [Python time reference server](https://github.com/modelcontextprotocol/servers/tree/main/src/time).

---

## Table of Contents

- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
  - [Claude Desktop Integration](#claude-desktop-integration)
  - [Cursor Integration](#cursor-integration)
  - [Cline/RooCoder Integration](#clineroocoder-integration)
- [For Developers](#for-developers)
  - [API Reference](#api-reference)
  - [Integration Examples](#integration-examples)
- [For End Users](#for-end-users)
  - [Using with AI Assistants](#using-with-ai-assistants)
  - [Example Questions](#example-questions)
- [Architecture](#architecture)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yoda-digital/horologic-mcp.git
   cd horologic-mcp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

---

## Configuration

### Claude Desktop Integration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "horologic-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/horologic-mcp/dist/index.js"],
      "env": {
        "LOCAL_TIMEZONE": "Europe/Chisinau"
      }
    }
  }
}
```

- Use the absolute path to your compiled JavaScript file
- The server name "horologic-mcp" will be how Claude identifies your server
- The optional environment variable `LOCAL_TIMEZONE` sets your default timezone

### Cursor Integration

To add Horologic MCP to Cursor:

1. Go to **Cursor Settings > Features > MCP**
2. Click on the **+ Add New MCP Server** button
3. Fill out the form:
   - **Type**: Select "stdio"
   - **Name**: "horologic-mcp"
   - **Command**: `node /absolute/path/to/horologic-mcp/dist/index.js`

```
# Example configuration in Cursor
Type: stdio
Name: horologic-mcp
Command: node /absolute/path/to/horologic-mcp/dist/index.js
```

### Cline/RooCoder Integration

To add Horologic MCP to Cline:

1. Open Cline settings
2. Navigate to the MCP configuration section
3. Add a new MCP server with:
   - **Name**: "horologic-mcp"
   - **Command**: `node /absolute/path/to/horologic-mcp/dist/index.js`

### Integration Steps

1. **Restart your AI assistant** after configuration
2. **Look for tool indicators** in the interface (e.g., hammer icon in Claude Desktop)
3. **Test** by asking questions about time and timezones

---

## For Developers

### API Reference

#### Tool: `get_current_time`

Gets the current time in a specific timezone.

**Input Schema:**

```json
{
  "timezone": "IANA timezone name (e.g., 'America/New_York', 'Europe/London')"
}
```

**Example Input:**

```json
{
  "timezone": "Asia/Tokyo"
}
```

**Output:**

```json
{
  "timezone": "Asia/Tokyo",
  "datetime": "2025-04-16T22:58:21+09:00",
  "is_dst": false
}
```

#### Tool: `convert_time`

Converts time between timezones.

**Input Schema:**

```json
{
  "source_timezone": "IANA timezone name",
  "time": "24-hour format (HH:MM)",
  "target_timezone": "IANA timezone name"
}
```

**Example Input:**

```json
{
  "source_timezone": "America/New_York",
  "time": "15:00",
  "target_timezone": "Europe/London"
}
```

**Output:**

```json
{
  "source": {
    "timezone": "America/New_York",
    "datetime": "2025-04-16T15:00:00-04:00",
    "is_dst": true
  },
  "target": {
    "timezone": "Europe/London",
    "datetime": "2025-04-16T20:00:00+01:00",
    "is_dst": true
  },
  "time_difference": "+5.0h"
}
```

### Integration Examples

#### Using with Node.js

```typescript
// Example: Integrating Horologic MCP with your application
import { McpClient } from "@modelcontextprotocol/client";

async function getTimeInDifferentTimezones() {
  const client = new McpClient();

  // Get current time in Tokyo
  const tokyoTime = await client.callTool("horologic-mcp", "get_current_time", {
    timezone: "Asia/Tokyo",
  });

  // Convert 3:00 PM from New York to London
  const convertedTime = await client.callTool("horologic-mcp", "convert_time", {
    source_timezone: "America/New_York",
    time: "15:00",
    target_timezone: "Europe/London",
  });

  console.log("Tokyo time:", tokyoTime);
  console.log("Converted time:", convertedTime);
}
```

#### Using with Python

```python
# Example: Integrating Horologic MCP with Python
from modelcontextprotocol.client import McpClient

async def get_time_in_different_timezones():
    client = McpClient()

    # Get current time in Tokyo
    tokyo_time = await client.call_tool("horologic-mcp", "get_current_time", {
        "timezone": "Asia/Tokyo"
    })

    # Convert 3:00 PM from New York to London
    converted_time = await client.call_tool("horologic-mcp", "convert_time", {
        "source_timezone": "America/New_York",
        "time": "15:00",
        "target_timezone": "Europe/London"
    })

    print("Tokyo time:", tokyo_time)
    print("Converted time:", converted_time)
```

---

## For End Users

### Using with AI Assistants

Horologic MCP enhances AI assistants' capabilities by providing accurate time and timezone information. Once configured, your AI assistant can answer time-related questions without needing external access.

#### Compatible AI Assistants

- **Claude Desktop**: Anthropic's AI assistant with native MCP support
- **Cursor**: AI-powered code editor with integrated MCP capabilities
- **Cline/RooCode**: Advanced AI coding assistant with MCP integration

### Example Questions

After setting up Horologic MCP with Claude Desktop, you can ask questions like:

```
- "What time is it right now in Tokyo?"
- "Can you convert 3:00 PM New York time to London time?"
- "What's the current time in Sydney, Australia?"
- "If it's 9:00 AM in Berlin, what time is it in San Francisco?"
- "What's the time difference between Paris and Tokyo?"
```

### How It Works

```
┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│             │     │               │     │             │
│    AI       │◄────┤ Horologic MCP │◄────┤  Time API   │
│  Assistant  │     │    Server     │     │             │
│             │     │               │     │             │
└─────────────┘     └───────────────┘     └─────────────┘
      ▲                                          ▲
      │                                          │
      │                                          │
      │                                          │
      ▼                                          │
┌─────────────┐                                  │
│             │                                  │
│    User     │──────────────────────────────────┘
│             │       (Timezone queries)
└─────────────┘
```

---

## Architecture

Horologic MCP is built on a modular, extensible architecture:

- **Core Engine:**  
  Written in TypeScript, leveraging modern language features and strict type safety.
- **Transport Layer:**  
  Uses STDIO transport for secure, local communication with MCP clients (e.g., Claude Desktop).
- **Tool Registration:**  
  Tools are defined with full JSON schema validation, robust error handling, and clear metadata for LLM consumption.
- **Security:**  
  Input validation, error isolation, and optional environment-based configuration for sensitive parameters.

---

## Security

- **Input Validation:**  
  All tool inputs are strictly validated against JSON schemas.
- **Error Handling:**  
  All errors are returned as structured MCP error responses, never as unhandled exceptions.
- **Transport Security:**  
  STDIO transport ensures local-only communication, minimizing attack surface.
- **Environment Configuration:**  
  Sensitive parameters (e.g., default timezone) can be set via environment variables.

---

## Troubleshooting

### Common Issues

#### AI assistant doesn't recognize the Horologic MCP tools

**Solution:** Ensure that:

1. The server is running (`npm start`)
2. The path in your configuration is correct and absolute
3. Your AI assistant has been restarted after configuration

#### Incorrect timezone information

**Solution:**

1. Verify the timezone name is a valid IANA timezone (e.g., "America/New_York", not "EST")
2. Check if your system clock is accurate
3. Set the `LOCAL_TIMEZONE` environment variable if your system timezone is incorrect

#### Server crashes on startup

**Solution:**

1. Ensure all dependencies are installed (`npm install`)
2. Verify the project is built (`npm run build`)
3. Check console output for specific error messages

---

## License

This project is licensed under the MIT License.  
© Yoda Digital. All rights reserved.
