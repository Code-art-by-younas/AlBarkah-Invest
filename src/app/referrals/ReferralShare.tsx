"use client";

import { useState } from "react";

export function ReferralShare({ code }: { code: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${code}`
      : `/register?ref=${code}`;

  function copy(value: string, which: "code" | "link") {
    navigator.clipboard.writeText(value);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="rounded-2xl border border-[#0a2e1c] bg-[#0a2e1c] p-5 text-white">
      <h2 className="font-bold text-[#ffd700]">Your Referral Code</h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center justify-between rounded-xl bg-white/10 px-4 py-3">
          <span className="text-lg font-extrabold tracking-widest">{code}</span>
          <button
            onClick={() => copy(code, "code")}
            className="rounded-lg bg-[#ffd700] px-3 py-1 text-sm font-bold text-[#0a2e1c]"
          >
            {copied === "code" ? "Copied!" : "Copy"}
          </button>
        </div>
        <button
          onClick={() => copy(link, "link")}
          className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold hover:bg-white/10"
        >
          {copied === "link" ? "Link Copied!" : "Copy Invite Link"}
        </button>
      </div>
    </div>
  );
}
