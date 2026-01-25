import { db } from "@/lib/db";
import { createEmbedding } from "./embed";

export async function storeEmbedding(
  conversationId: string,
  content: string
) {
  const embedding = await createEmbedding(content);

  await db.query(
    `INSERT INTO message_embeddings (conversation_id, content, embedding)
     VALUES ($1, $2, $3)`,
    [conversationId, content, embedding]
  );
}
export async function getEmbeddings(
  conversationId: string
): Promise<Array<{ content: string; embedding: number[] }>> {
  const rows = await db.query(
    `SELECT content, embedding FROM message_embeddings WHERE conversation_id = $1`,
    [conversationId]
  );

  return rows.map((row: any) => ({
    content: row.content,
    embedding: row.embedding
  }));
}   