import { db } from "@/lib/db";
import { chunkText } from "./chunker";
import { createEmbedding } from "@/lib/memory/embed";

export async function ingestDocument(title: string, content: string) {
  const { rows } = await db.query(
    `INSERT INTO documents (title, content)
     VALUES ($1, $2)
     RETURNING id`,
    [title, content]
  );

  const documentId = rows[0].id;
  const chunks = chunkText(content);

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    await db.query(
      `INSERT INTO message_embeddings (content, embedding)
       VALUES ($1, $2)`,
      [chunk, embedding]
    );
  }

  return documentId;
}
