"use client";

import { useEffect, useRef } from "react";
import { Clock, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { PENDING_STATUS_POLL_INTERVAL } from "@/constants";

interface StatusResponse {
  status: string;
}

export default function PendingPage() {
  const { data: session, update } = useSession();

  /**
   * Guard — tránh double-redirect khi checkStatus chạy song song
   * (mount + interval overlap).
   */
  const redirectingRef = useRef(false);

  /**
   * Poll /api/proxy/auth/status mỗi 10 giây (+ check ngay lúc mount).
   *
   * Khi backend xác nhận approved/rejected:
   *   1. Pass status trực tiếp vào update({ status }) để jwt callback
   *      cập nhật token mà không cần server-side fetch (tránh fail silent).
   *   2. window.location.href — full navigation, đảm bảo middleware
   *      đọc cookie mới sau khi update() đã set xong.
   *
   * Không dùng getSession() — trả JWT cache, không phản ánh status mới từ DB.
   */
  useEffect(() => {
    const checkStatus = async (): Promise<void> => {
      if (redirectingRef.current) return;

      try {
        const res = await fetch("/api/proxy/auth/status");
        if (!res.ok) return;

        const data = (await res.json()) as StatusResponse;

        if (data.status === "approved" || data.status === "rejected") {
          redirectingRef.current = true;
          // Pass status vào update() — jwt callback nhận qua param `session`
          await update({ status: data.status });
          window.location.href = data.status === "approved" ? "/" : "/rejected";
        }
      } catch {
        // Silent — thử lại lần sau
      }
    };

    // Check ngay lúc mount — xử lý reload sau khi đã được approve
    void checkStatus();

    const interval = setInterval(checkStatus, PENDING_STATUS_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [update]);

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div
        className="w-full max-w-sm rounded-2xl border p-8 text-center card-glass"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "color-mix(in srgb, var(--signal-hold) 15%, transparent)" }}
        >
          <Clock size={28} style={{ color: "var(--signal-hold)" }} />
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Tài khoản đang chờ duyệt
        </h1>

        {session?.user?.name && (
          <p className="text-sm mb-3" style={{ color: "var(--muted-foreground)" }}>
            Xin chào,{" "}
            <span className="font-medium" style={{ color: "var(--foreground)" }}>
              {session.user.name}
            </span>
            .
          </p>
        )}

        <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
          Tài khoản của bạn đang chờ admin phê duyệt. Trang này sẽ tự động
          chuyển hướng khi tài khoản được kích hoạt.
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 mx-auto text-sm px-4 py-2 rounded-lg transition-colors"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          <LogOut size={14} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
