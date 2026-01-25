export async function buildContext(
  conversationId: string,
  userMessage: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/messages?conversationId=${conversationId}`,
    { cache: "no-store" }
  );

  const messages = await res.json();

  return messages.reverse().map((m: any) => ({
    role: m.role,
    content: m.content
  }));
}

