import { createConversation, getConversations } from "@/lib/db/queries";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await getConversations(session.user.id);
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convo = await createConversation(session.user.id);
  return new Response(JSON.stringify(convo), { status: 200 });
}
