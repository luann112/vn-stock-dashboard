"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Bell, TrendingUp, Activity, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavItem {
  href:        string;
  label:       string;
  description: string;
  icon:        React.ComponentType<{ size?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/watchlist", label: "Danh mục", description: "Watchlist",    icon: BarChart2 },
  { href: "/alerts",   label: "Cảnh báo",  description: "Alert Center", icon: Bell },
  { href: "/heatmap",  label: "Heatmap",   description: "Thị trường",   icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  function handleLogout(): void {
    void signOut({ callbackUrl: "/login" });
  }

  return (
    <aside
      className="flex flex-col w-56 shrink-0 border-r h-full glass-sidebar"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "var(--primary)" }}
        >
          <TrendingUp size={16} style={{ color: "var(--primary-foreground)" }} />
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            VN Stock
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            HOSE / HNX
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, description }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium"
              style={{
                background: isActive ? "var(--accent)" : "transparent",
                color:      isActive ? "var(--accent-foreground)" : "var(--muted-foreground)",
              }}
            >
              <Icon size={16} />
              <div>
                <div>{label}</div>
                <div className="text-xs opacity-70 font-normal">{description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div
        className="flex items-center justify-between px-4 py-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <ThemeToggle />
        <button
          onClick={handleLogout}
          title="Đăng xuất"
          className="p-1.5 rounded-lg transition-colors opacity-60 hover:opacity-100"
          style={{ color: "var(--muted-foreground)" }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
