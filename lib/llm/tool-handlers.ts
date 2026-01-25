type ToolContext = {
  conversationId: string;
};

export async function executeTool(
  toolName: string,
  args: any,
  ctx: ToolContext
): Promise<string> {
  switch (toolName) {
    case "search_docs":
      return await searchDocs(args.query);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

async function searchDocs(query: string): Promise<string> {
  // placeholder – real RAG below
  return `Search results for: ${query}`;
}
// Real RAG implementation would go here  