import OpenAI from "openai";
import { tools } from "./tools";
import { executeTool } from "./tool-handlers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function runAgent(messages: any[]) {
  let loop = true;
  let currentMessages = [...messages];

  while (loop) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: currentMessages,
      tools
    });

    const choice = response.choices[0];

    // Tool requested
    if (choice.finish_reason === "tool_calls") {
      for (const call of choice.message.tool_calls!) {
        const result = await executeTool(
          call.function.name,
          JSON.parse(call.function.arguments)
        );

        currentMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: result
        });
      }
    } else {
      // Final answer
      loop = false;
      currentMessages.push(choice.message);
    }
  }

  return currentMessages;
}
