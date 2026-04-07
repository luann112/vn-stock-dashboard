"use client";

import { useEffect } from "react";
import { Clock, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { REFRESH_INTERVAL } from "@/constants";

export default function PendingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Poll session mỗi 30 giây — nếu status đổi thành approved thì redirect
  useEffect(() => {
    const interval = setInterval(async () => {
      const { getSession } = await import("next-auth/react");
      const fresh = await getSession();
      if (fresh?.user?.status === "approved") {
        router.push("/");
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div
      className="flex h-screen items-center justify-center p-6"
    >
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
          Tài khoản của bạn đang chờ admin phê duyệt. Trang này sẽ tự động chuyển hướng khi
          tài khoản được kích hoạt.
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
