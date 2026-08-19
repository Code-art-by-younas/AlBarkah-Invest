import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlBarkah Invest — Invest in Trust, Grow in Blessing",
  description:
    "AlBarkah Invest — a halal-focused investment platform. Invest, earn daily profits for 90 days, and grow through referrals.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1a1a1a] antialiased">{children}</body>
    </html>
  );
}
