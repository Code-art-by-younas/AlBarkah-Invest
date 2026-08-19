"use client";

import { useState } from "react";

export function RunRewardsButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function run() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/cron/daily-rewards", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Credited ${data.credited} plans (${data.processed} active).`);
      } else {
        setMsg(data.error ?? "Failed");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={run}
        disabled={loading}
        className="rounded-lg bg-[#0a2e1c] px-4 py-2 text-sm font-bold text-white hover:bg-[#12503a] disabled:opacity-60"
      >
        {loading ? "Running..." : "Run Daily Rewards Now"}
      </button>
      {msg && <span className="text-sm text-black/70">{msg}</span>}
    </div>
  );
}
