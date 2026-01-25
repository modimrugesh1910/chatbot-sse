import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/lib/db";

/**
 * Auth.js configuration
 * Edge-compatible
 */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    /**
     * Attach user id to JWT
     */
    async jwt({ token, profile }) {
      if (profile?.email) {
        const { rows } = await db.query(
          `SELECT id FROM users WHERE email = $1`,
          [profile.email]
        );

        if (rows.length === 0) {
          const { rows: created } = await db.query(
            `INSERT INTO users (email)
             VALUES ($1)
             RETURNING id`,
            [profile.email]
          );
          token.userId = created[0].id;
        } else {
          token.userId = rows[0].id;
        }
      }

      return token;
    },

    /**
     * Expose user id in session
     */
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  }
});
