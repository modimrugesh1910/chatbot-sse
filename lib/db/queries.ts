import { db } from "./index";
import { storeEmbedding } from "@/lib/memory/store";
import { prisma } from "./prisma";

export async function createConversation(userId: string) {
  const { rows } = await db.query(
    `INSERT INTO conversations (user_id)
     VALUES ($1)
     RETURNING *`,
    [userId]
  );
  return rows[0];
}

export async function getConversations(userId: string) {
  const { rows } = await db.query(
    `SELECT * FROM conversations WHERE user_id=$1`,
    [userId]
  );
  return rows;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  await db.query(
    `INSERT INTO messages (conversation_id, role, content)
     VALUES ($1, $2, $3)`,
    [conversationId, role, content]
  );

  // Only embed assistant + user messages
  await storeEmbedding(conversationId, content);
}

export async function getRecentMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}

export async function getMessages(conversationId: string) {
  const { rows } = await db.query(
    `SELECT role, content
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
);

  return rows;
}