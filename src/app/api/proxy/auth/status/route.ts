/**
 * GET /api/proxy/auth/status
 *
 * Server-side proxy tới FastAPI GET /api/auth/status.
 * Đính kèm accessToken từ session — client không cần giữ token.
 * Dùng bởi /pending page để poll trạng thái duyệt tài khoản.
 */
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const GET = auth(async (req) => {
  const accessToken = req.auth?.user?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    const data: unknown = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Không thể kết nối đến server." },
      { status: 502 }
    );
  }
});
