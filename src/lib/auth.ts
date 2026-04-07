import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              email:    credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) return null;
          // FastAPI trả về { id, email, name?, status, role, access_token }
          const user = await res.json() as Record<string, unknown>;
          if (!user) return null;
          return {
            id:          String(user["id"] ?? ""),
            email:       String(user["email"] ?? ""),
            name:        String(user["name"] ?? user["email"] ?? ""),
            status:      String(user["status"] ?? "pending"),
            role:        String(user["role"] ?? "user"),
            accessToken: String(user["access_token"] ?? ""),
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["id"]          = user.id;
        token["status"]      = user.status;
        token["role"]        = user.role;
        token["accessToken"] = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id          = token["id"]          as string;
        session.user.status      = token["status"]      as string;
        session.user.role        = token["role"]        as string;
        session.user.accessToken = token["accessToken"] as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
