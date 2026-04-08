import { NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: unknown = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "Không thể kết nối đến server." },
      { status: 502 }
    );
  }
}
