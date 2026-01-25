export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export type ChatHistory = ChatMessage[];

export type ChatRequest = {
  model: string;
  messages: ChatHistory;
  temperature?: number;
  max_tokens?: number;
};  