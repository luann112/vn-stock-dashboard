"use client";

import { useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants";
import { AuthLayout, AuthInput } from "@/components/auth-layout";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { detail?: string; error?: string };
        const msg = data.detail ?? data.error ?? `Lỗi ${res.status}`;
        setError(String(msg));
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Không thể kết nối đến server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Tài khoản cần được admin duyệt trước khi sử dụng."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/login" style={{ color: "var(--primary)" }}>
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="name"
          label="Họ tên"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Nguyễn Văn A"
        />
        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          hasError={Boolean(error)}
        />
        <AuthInput
          id="password"
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          minLength={8}
          hasError={Boolean(error)}
        />

        {error && (
          <p className="text-xs" style={{ color: "var(--bear)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !name || !email || !password}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {isLoading ? (
            <span>Đang đăng ký…</span>
          ) : (
            <>
              <UserPlus size={15} />
              <span>Đăng ký</span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
