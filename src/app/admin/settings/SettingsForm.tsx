"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  opayName: string;
  opayNumber: string;
  minDeposit: string;
  minWithdrawal: string;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [f, setF] = useState({
    opayName: initial.opayName,
    opayNumber: initial.opayNumber,
    minDeposit: initial.minDeposit,
    minWithdrawal: initial.minWithdrawal,
    level1: String(initial.level1),
    level2: String(initial.level2),
    level3: String(initial.level3),
    level4: String(initial.level4),
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opayName: f.opayName,
          opayNumber: f.opayNumber,
          minDeposit: parseFloat(f.minDeposit) || 0,
          minWithdrawal: parseFloat(f.minWithdrawal) || 0,
          level1: parseFloat(f.level1) || 0,
          level2: parseFloat(f.level2) || 0,
          level3: parseFloat(f.level3) || 0,
          level4: parseFloat(f.level4) || 0,
        }),
      });
      const data = await res.json();
      setMsg(res.ok ? "✅ Saved" : data.error ?? "Failed");
      if (res.ok) router.refresh();
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-[#0a2e1c] focus:ring-2 focus:ring-[#0a2e1c]/10";

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold text-[#0a2e1c]">OPay Details</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">Account Name</label>
            <input className={input} value={f.opayName} onChange={(e) => setF({ ...f, opayName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">OPay Number</label>
            <input className={input} value={f.opayNumber} onChange={(e) => setF({ ...f, opayNumber: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold text-[#0a2e1c]">Limits (PKR)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">Min Deposit</label>
            <input className={input} type="number" value={f.minDeposit} onChange={(e) => setF({ ...f, minDeposit: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Min Withdrawal</label>
            <input className={input} type="number" value={f.minWithdrawal} onChange={(e) => setF({ ...f, minWithdrawal: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold text-[#0a2e1c]">Referral Commission (%)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["level1", "level2", "level3", "level4"] as const).map((k, i) => (
            <div key={k}>
              <label className="mb-1 block text-sm font-semibold">Level {i + 1}</label>
              <input
                className={input}
                type="number"
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={loading}
          className="rounded-lg bg-[#0a2e1c] px-6 py-2.5 font-bold text-white hover:bg-[#12503a] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {msg && <span className="text-sm text-black/70">{msg}</span>}
      </div>
    </form>
  );
}
