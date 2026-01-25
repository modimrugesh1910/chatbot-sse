export const runtime = "edge";

import { buildContext } from "@/lib/memory/context";
import { runAgent } from "@/lib/llm/agent";
import { streamFinalAnswer } from "@/lib/llm/agent-stream";

export async function POST(req: Request) {
  const { conversationId, message } = await req.json();

  // 1️⃣ Save USER message (Node route)
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId,
      role: "user",
      content: message
    })
  });

  // 2️⃣ Build context (Node fetch inside)
  const context = await buildContext(conversationId, message);

  // 3️⃣ Run agent (LLM only)
  const agentMessages = await runAgent([
    { role: "system", content: "You are a smart agent. Use tools when needed." },
    ...context,
    { role: "user", content: message }
  ]);

  // 4️⃣ Stream final answer
  const stream = await streamFinalAnswer(agentMessages);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache"
    }
  });
}
