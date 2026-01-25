export const runtime = "nodejs";

import { saveMessage } from "@/lib/db/queries";

export async function POST(req: Request) {
  const body = await req.json();

  if (!Array.isArray(body)) {
    return new Response("Invalid payload", { status: 400 });
  }

  try {
    for (const msg of body) {
      // idempotent save (optional: deduplicate by timestamp or hash)
      await saveMessage(msg.conversationId, msg.role, msg.content);
    }
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error(err);
    return new Response("Failed to save messages", { status: 500 });
  }
}
