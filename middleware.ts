import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session      = req.auth;
  const status       = session?.user?.status;

  // Public routes — ai cũng vào được
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(pathname)) return NextResponse.next();

  // Chưa login → redirect /login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Đã login nhưng PENDING → chỉ cho vào /pending
  if (status === "pending" && pathname !== "/pending") {
    return NextResponse.redirect(new URL("/pending", req.url));
  }

  // REJECTED → chỉ cho vào /rejected
  if (status === "rejected" && pathname !== "/rejected") {
    return NextResponse.redirect(new URL("/rejected", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
