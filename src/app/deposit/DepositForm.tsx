"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type PlanData = {
  id: string;
  name: string;
  amount: string;
  dailyProfit: string;
  totalProfit: string;
};

function fmt(v: string) {
  const n = parseFloat(v);
  return new Intl.NumberFormat("en-PK").format(n) + " PKR";
}

function Inner({ plans }: { plans: PlanData[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [planId, setPlanId] = useState(params.get("plan") ?? plans[0]?.id ?? "");
  const [senderName, setSenderName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const selected = plans.find((p) => p.id === planId);

  useEffect(() => {
    const p = params.get("plan");
    if (p && plans.some((pl) => pl.id === p)) setPlanId(p);
  }, [params, plans]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!screenshot) {
      setError("Please upload your payment screenshot");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, screenshot, senderName, transactionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-[#0a2e1c] focus:ring-2 focus:ring-[#0a2e1c]/10";

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="mt-2 font-bold text-green-800">Deposit submitted!</h2>
        <p className="text-sm text-green-700">
          Your deposit is pending admin approval. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-white p-6">
      {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <label className="mb-1 block text-sm font-semibold text-[#0a2e1c]">Select Plan</label>
      <select className={input} value={planId} onChange={(e) => setPlanId(e.target.value)}>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {fmt(p.amount)}
          </option>
        ))}
      </select>

      {selected && (
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#f5f5f5] p-3 text-center text-xs">
          <div>
            <div className="text-black/50">Amount</div>
            <div className="font-bold text-[#0a2e1c]">{fmt(selected.amount)}</div>
          </div>
          <div>
            <div className="text-black/50">Daily</div>
            <div className="font-bold text-[#c9a227]">{fmt(selected.dailyProfit)}</div>
          </div>
          <div>
            <div className="text-black/50">Total</div>
            <div className="font-bold text-[#0a2e1c]">{fmt(selected.totalProfit)}</div>
          </div>
        </div>
      )}

      <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">
        Sender Name (optional)
      </label>
      <input className={input} value={senderName} onChange={(e) => setSenderName(e.target.value)} />

      <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">
        Transaction ID (optional)
      </label>
      <input
        className={input}
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
      />

      <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">
        Payment Screenshot
      </label>
      <input type="file" accept="image/*" onChange={onFile} className="block text-sm" />
      {screenshot && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={screenshot} alt="preview" className="mt-3 max-h-48 rounded-lg border border-black/10" />
      )}

      <button
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-[#0a2e1c] py-2.5 font-bold text-white hover:bg-[#12503a] disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Deposit"}
      </button>
    </form>
  );
}

export function DepositForm({ plans }: { plans: PlanData[] }) {
  return (
    <Suspense>
      <Inner plans={plans} />
    </Suspense>
  );
}
