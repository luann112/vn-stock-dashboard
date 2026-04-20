import { BarChart2 } from "lucide-react";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div
        className="w-full max-w-sm rounded-2xl border p-8 card-surface"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <BarChart2 size={18} style={{ color: "var(--primary-foreground)" }} />
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
            VN Stock
          </span>
        </div>

        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          {title}
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
          {subtitle}
        </p>

        {children}

        <p className="text-xs mt-6 text-center" style={{ color: "var(--muted-foreground)" }}>
          {footer}
        </p>
      </div>
    </div>
  );
}
