import OpenAI from "openai";
import { db } from "@/lib/db";
import { prisma } from "@/lib/db/prisma";
import { summarize } from "@/lib/llm/summarizer";

const openai = new OpenAI();

export async function summarizeConversation(conversationId: string) {
  const { rows } = await db.query(
    `SELECT content FROM messages WHERE conversation_id=$1`,
    [conversationId]
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `Summarize this conversation:\n${rows.map(r => r.content).join("\n")}`
    }]
  });

  await db.query(
    `UPDATE conversations SET summary=$1 WHERE id=$2`,
    [completion.choices[0].message.content, conversationId]
  );
}

export async function updateSummary(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" }
  });

  const summary = await summarize(
    messages.map(m => `${m.role}: ${m.content}`).join("\n")
  );

  await prisma.conversationSummary.upsert({
    where: { conversationId },
    update: { summary },
    create: { conversationId, summary }
  });
}
