import { NextResponse } from "next/server";
import mammoth from "mammoth";

import { parsePdf } from "@/lib/pdf/parsePdf";
import { chunkText } from "@/lib/text/chunkText";
import { embed } from "@/lib/llm/embeddings";
import { prisma } from "@/lib/db/prisma";

// IMPORTANT: force Node runtime
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!(file instanceof File) || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid file or userId" },
        { status: 400 }
      );
    }

    // Convert file to Buffer (Node-only)
    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedText = "";

    // ---------- FILE TYPE HANDLING ----------
    if (file.type === "application/pdf") {
      const parsed = await parsePdf(buffer);
      extractedText = parsed.text;
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from file" },
        { status: 400 }
      );
    }

    // ---------- CREATE DOCUMENT ----------
    const document = await prisma.document.create({
      data: {
        title: file.name,
        userId,
      },
    });

    // ---------- CHUNK + EMBED ----------
    const chunks = chunkText(extractedText, 800, 100);

    await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await embed(chunk);

        await prisma.documentChunk.create({
          data: {
            documentId: document.id,
            content: chunk,
            embedding,
          },
        });
      })
    );

    return NextResponse.json({
      status: "ok",
      documentId: document.id,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error("Ingest error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
