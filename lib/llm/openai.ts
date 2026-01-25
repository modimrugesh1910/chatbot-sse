import OpenAI from "openai";
import { tools } from "./tools";
import { handleToolCall } from "./tool-handlers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function streamChatCompletion(messages: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools,
    stream: true
  });

  const stream = response.toReadableStream();

  // Tool calls are handled client-side after stream
  return stream;
}
export async function callTool(toolName: string, toolInput: any) {
  const tool = tools.find(t => t.name === toolName);
  if (!tool) {
    throw new Error("Unknown tool");
  }

  return handleToolCall(toolName, toolInput);
}