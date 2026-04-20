"use client";

import { Suspense, useState, type FormEvent } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthLayout, AuthInput } from "@/components/auth-layout";

function RegisteredBanner(): React.ReactNode {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  if (!registered) return null;

  return (
    <div
      className="text-xs px-3 py-2.5 rounded-lg mb-4"
      style={{ background: "var(--bull-muted)", color: "var(--bull-foreground)" }}
    >
      Đăng ký thành công — vui lòng chờ admin duyệt tài khoản.
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Nhập thông tin tài khoản để tiếp tục."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/register" style={{ color: "var(--primary)" }}>
            Đăng ký
          </Link>
        </>
      }
    >
      <Suspense>
        <RegisteredBanner />
      </Suspense>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          hasError={Boolean(error)}
        />

        {error && (
          <p className="text-xs" style={{ color: "var(--bear)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-lg disabled:opacity-50"
        >
          {isLoading ? (
            <span>Đang đăng nhập…</span>
          ) : (
            <>
              <LogIn size={15} />
              <span>Đăng nhập</span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
