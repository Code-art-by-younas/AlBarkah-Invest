"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";

interface PublicNavbarProps {
  session: any;
}

export function PublicNavbar({ session }: PublicNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#how-it-works" className="text-gray-600 hover:text-[#0a2e1c]">
            How It Works
          </a>
          <a href="#plans" className="text-gray-600 hover:text-[#0a2e1c]">
            Plans
          </a>
          <Link href="/support" className="text-gray-600 hover:text-[#0a2e1c]">
            Support
          </Link>
          <a
            href="https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:underline"
          >
            WhatsApp
          </a>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-[#0a2e1c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12503a]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-[#0a2e1c]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#ffd700] px-4 py-2 text-sm font-semibold text-[#0a2e1c] transition hover:bg-[#e6c200]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <a href="#how-it-works" className="text-gray-600 hover:text-[#0a2e1c]" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
            <a href="#plans" className="text-gray-600 hover:text-[#0a2e1c]" onClick={() => setMenuOpen(false)}>
              Plans
            </a>
            <Link href="/support" className="text-gray-600 hover:text-[#0a2e1c]" onClick={() => setMenuOpen(false)}>
              Support
            </Link>
            <a
              href="https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366]"
              onClick={() => setMenuOpen(false)}
            >
              WhatsApp
            </a>
            <div className="mt-2 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" className="rounded-lg bg-[#0a2e1c] px-4 py-2 text-center text-white" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-center text-sm text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-center text-gray-600" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="rounded-lg bg-[#ffd700] px-4 py-2 text-center font-semibold text-[#0a2e1c]" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}