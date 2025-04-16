declare module '@modelcontextprotocol/sdk' {
  export class Server {
    constructor(
      serverInfo: { name: string; version: string },
      options?: { instructions?: string }
    );

    tool(
      name: string,
      description: string,
      inputSchema: any,
      options: { annotations: ToolAnnotations },
      handler: (params: any, context: any) => Promise<CallToolResult>
    ): void;

    connect(transport: any): Promise<void>;
    close(): Promise<void>;
  }

  export class StdioServerTransport {
    constructor();
  }

  export interface ToolAnnotations {
    title: string;
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
  }

  export interface CallToolResult {
    isError?: boolean;
    content: Array<{ type: string; text: string }>;
  }

  export const z: {
    string(): {
      describe(description: string): any;
    };
    number(): {
      describe(description: string): any;
    };
    boolean(): {
      describe(description: string): any;
    };
    object(): {
      describe(description: string): any;
    };
    array(): {
      describe(description: string): any;
    };
  };
}