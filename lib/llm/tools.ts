export const tools = [
  {
    type: "function",
    function: {
      name: "get_conversation_summary",
      description: "Get summary of a conversation",
      parameters: {
        type: "object",
        properties: {
          conversationId: { type: "string" }
        },
        required: ["conversationId"]
      }
    }
  }
];
export type Tool = (typeof tools)[number];