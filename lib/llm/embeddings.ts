import OpenAI from "openai";

/**
 * Node-only embedding helper
 * Do NOT import in Edge routes
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function embed(text: string): Promise<number[]> {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  return res.data[0].embedding;
}
