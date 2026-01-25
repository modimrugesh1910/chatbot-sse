import { db } from "@/lib/db";

export async function getRecentMessages(conversationId: string) {
  const { rows } = await db.query(
    `SELECT role, content
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at DESC
     LIMIT 6`,
    [conversationId]
  );

  return rows.reverse();
}
