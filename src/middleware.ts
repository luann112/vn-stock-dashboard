/**
 * src/middleware.ts — Route protection cho toàn bộ dashboard.
 *
 * Logic:
 *   /login, /register  → Public. Nếu đã login: redirect theo status.
 *   /pending           → Chỉ logged-in. Nếu approved: redirect /.
 *   /rejected          → Chỉ logged-in. Nếu approved: redirect /.
 *   /admin/*           → Phải approved + role=owner.
 *   Mọi route còn lại  → Phải approved. Redirect theo status nếu chưa đủ điều kiện.
 */
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const PUBLIC_ROUTES   = ["/login", "/register"] as const;
const HOLDING_ROUTES  = ["/pending", "/rejected"] as const;

function redirect(req: NextAuthRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, req.url));
}

export default auth((req: NextAuthRequest) => {
  const session  = req.auth;
  const pathname = req.nextUrl.pathname;

  const isLoggedIn = !!session?.user;
  const status     = session?.user?.status ?? "";
  const role       = session?.user?.role   ?? "";
  const isApproved = status === "approved";

  // ── Public routes: /login, /register ──────────────────────────────────────
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) return NextResponse.next();
    if (status === "pending")  return redirect(req, "/pending");
    if (status === "rejected") return redirect(req, "/rejected");
    if (isApproved)            return redirect(req, "/");
    return NextResponse.next();
  }

  // ── Holding routes: /pending, /rejected ───────────────────────────────────
  if (HOLDING_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) return redirect(req, "/login");
    if (isApproved)  return redirect(req, "/");
    return NextResponse.next();
  }

  // ── Admin routes: chỉ owner được vào ─────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !isApproved) return redirect(req, "/login");
    if (role !== "owner")           return redirect(req, "/");
    return NextResponse.next();
  }

  // ── Dashboard routes: phải approved ──────────────────────────────────────
  if (!isLoggedIn)           return redirect(req, "/login");
  if (status === "pending")  return redirect(req, "/pending");
  if (status === "rejected") return redirect(req, "/rejected");

  return NextResponse.next();
});

export const config = {
  // Bỏ qua: API routes nội bộ, static files, favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
