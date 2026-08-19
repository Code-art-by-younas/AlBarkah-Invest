"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/plans", label: "Plans", icon: "📊" },
  { href: "/deposit", label: "Deposit", icon: "💳" },
  { href: "/withdrawal", label: "Withdraw", icon: "💸" },
  { href: "/referrals", label: "Referrals", icon: "👥" },
  { href: "/transactions", label: "History", icon: "🧾" },
  { href: "/support", label: "Support", icon: "📞" },
  { href: "https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26", label: "WhatsApp", icon: "📱", external: true },
];

export function UserShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ===== STICKY HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-[#0a2e1c]/10 bg-[#0a2e1c] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 hover:bg-white/10 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Logo light />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-300 sm:inline">👋 {username}</span>
            <button
              onClick={logout}
              className="rounded-lg bg-[#ffd700] px-3 py-1.5 text-sm font-semibold text-[#0a2e1c] transition hover:bg-[#e6c200]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Sidebar desktop */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="space-y-1 rounded-xl bg-white p-3 shadow-sm">
            {NAV.map((n) => {
              const active = pathname === n.href;
              if (n.external) {
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-[#0a2e1c]/5 hover:text-[#0a2e1c]"
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
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#0a2e1c] text-white"
                      : "text-gray-600 hover:bg-[#0a2e1c]/5 hover:text-[#0a2e1c]"
                  }`}
                >
                  <span>{n.icon}</span>
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div
              className="absolute left-0 top-0 h-full w-64 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <Logo />
              </div>
              <nav className="space-y-1">
                {NAV.map((n) => {
                  if (n.external) {
                    return (
                      <a
                        key={n.href}
                        href={n.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#0a2e1c]/5"
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
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
                        pathname === n.href
                          ? "bg-[#0a2e1c] text-white"
                          : "text-gray-600 hover:bg-[#0a2e1c]/5"
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
    </div>
  );
}