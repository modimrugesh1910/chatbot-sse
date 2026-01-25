import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/cache/rate-limit";

export async function middleware(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { success } = await rateLimit.limit(session.user.id);
  if (!success) return new Response("Too Many Requests", { status: 429 });

  return Response.next();
}

export const config = {
  matcher: ["/api/chat/:path*"]
};
