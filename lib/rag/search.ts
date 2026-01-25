import { embed } from "@/lib/llm/embeddings";
import { similaritySearch } from "@/lib/db/vector";

export async function ragSearch(query: string) {
  const embedding = await embed(query);
  const chunks = await similaritySearch(embedding);

  return chunks.map(c => c.content).join("\n\n");
}
