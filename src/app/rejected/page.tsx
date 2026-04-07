"use client";

import { XCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function RejectedPage() {
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
          style={{ background: "var(--bear-muted)" }}
        >
          <XCircle size={28} style={{ color: "var(--bear)" }} />
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Tài khoản bị từ chối
        </h1>

        <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
          Tài khoản của bạn đã bị admin từ chối. Vui lòng liên hệ admin để biết thêm thông tin.
        </p>

        <p className="text-xs mb-8" style={{ color: "var(--muted-foreground)" }}>
          Nếu bạn cho rằng đây là nhầm lẫn, hãy liên hệ quản trị viên hệ thống.
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
