import { NextRequest, NextResponse } from "next/server";
import * as pdf from "pdf-parse";
import mammoth from "mammoth";
import { createEmbedding } from "@/lib/memory/embed";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function chunkText(text: string, size = 800, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }

  return chunks;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";

  if (file.type === "application/pdf") {
    const data = await pdf(buffer);
    text = data.text;
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }

  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    await db.query(
      `INSERT INTO documents (content)
       VALUES ($1)`,
      [chunk]
    );

    await db.query(
      `INSERT INTO message_embeddings (content, embedding)
       VALUES ($1, $2)`,
      [chunk, embedding]
    );
  }

  return NextResponse.json({
    status: "ok",
    chunks: chunks.length
  });
}
