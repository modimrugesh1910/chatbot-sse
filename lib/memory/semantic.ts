import { db } from "@/lib/db";
import { createEmbedding } from "./embed";

export async function semanticSearch(
  query: string,
  collection: string
) {
  const embedding = await createEmbedding(query);

  const { rows } = await db.query(
    `
    SELECT content
    FROM message_embeddings
    WHERE metadata->>'collection' = $2
    ORDER BY embedding <-> $1
    LIMIT 5
    `,
    [embedding, collection]
  );

  return rows.map((r: { content: any; }) => ({
    role: "system",
    content: `Relevant context:\n${r.content}`
  }));
}

export async function semanticDocumentSearch(query: string) {
  const embedding = await createEmbedding(query);
  const { rows } = await db.query(
    `
    SELECT content
    FROM documents
    ORDER BY embedding <-> $1
    LIMIT 5
    `,
    [embedding]
  );

  return rows.map((r: { content: any; }) => ({
    role: "system",
    content: `Relevant context:\n${r.content}`
  }));
}

