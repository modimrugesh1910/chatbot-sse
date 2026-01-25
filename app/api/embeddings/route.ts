export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * This route:
 * - Accepts text
 * - Returns vector embeddings
 * - Used by RAG + ingestion
 */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input text is required" },
        { status: 400 }
      );
    }

    const embeddingResponse = await client.embeddings.create({
      model: "text-embedding-3-small",
      input
    });

    return NextResponse.json({
      embedding: embeddingResponse.data[0].embedding
    });
  } catch (error) {
    console.error("Embedding error:", error);
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}
