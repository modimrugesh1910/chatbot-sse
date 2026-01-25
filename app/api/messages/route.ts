export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { saveMessage, getRecentMessages } from "@/lib/db/queries";

export async function POST(req: Request) {
  const { conversationId, role, content } = await req.json();

  const message = await saveMessage(conversationId, role, content);

  return NextResponse.json(message);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId required" },
      { status: 400 }
    );
  }

  const messages = await getRecentMessages(conversationId);
  return NextResponse.json(messages);
}
