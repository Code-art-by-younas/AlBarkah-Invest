"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/deposits", label: "Deposits", icon: "💳" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "💸" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  { href: "/support", label: "Support", icon: "📞" },
  { href: "https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26", label: "WhatsApp", icon: "📱", external: true },
];

export function AdminShell({ children, username }: { children: React.ReactNode; username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#0a2e1c] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-white/10 md:hidden" onClick={() => setOpen(!open)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Logo light />
            <span className="rounded-full bg-[#ffd700] px-2 py-0.5 text-xs font-bold text-[#0a2e1c]">ADMIN</span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="space-y-1">
            {NAV.map((n) => {
              const active = pathname === n.href;
              if (n.external) {
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-black/70 hover:bg-white"
                  >
                    <span>{n.icon}</span>
                    {n.label}
                  </a>
                );
              }
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
                    active ? "bg-[#0a2e1c] text-white" : "text-black/70 hover:bg-white"
                  }`}
                >
                  <span>{n.icon}</span>
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute left-0 top-0 h-full w-64 bg-white p-4" onClick={(e) => e.stopPropagation()}>
              <nav className="space-y-1">
                {NAV.map((n) => {
                  if (n.external) {
                    return (
                      <a
                        key={n.href}
                        href={n.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-black/70 hover:bg-[#f5f5f5]"
                        onClick={() => setOpen(false)}
                      >
                        <span>{n.icon}</span>
                        {n.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
                        pathname === n.href ? "bg-[#0a2e1c] text-white" : "text-black/70 hover:bg-[#f5f5f5]"
                      }`}
                    >
                      <span>{n.icon}</span>
                      {n.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-[#0a2e1c] py-4 text-center text-sm text-gray-300">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
            <p>© 2026 AlBarkah Invest. All rights reserved.</p>
            <a
              href="https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#25D366] hover:underline"
            >
              <span>📱</span> Join WhatsApp Channel
            </a>
            <a href="tel:03276376052" className="flex items-center gap-1 text-[#ffd700] hover:underline">
              <span>📞</span> Support: 0327-6376052
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}