"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const METHODS = [
  { value: "easypaisa", label: "Easypaisa" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "sadapay", label: "SadaPay" },
  { value: "opay", label: "OPay" },
  { value: "bank", label: "Bank Transfer" },
];

export function WithdrawalForm({
  balance,
  minWithdrawal,
}: {
  balance: string;
  minWithdrawal: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("easypaisa");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (amt < parseFloat(minWithdrawal)) {
      setError(`Minimum withdrawal is ${minWithdrawal} PKR`);
      return;
    }
    if (amt > parseFloat(balance)) {
      setError("Insufficient balance");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, method, accountName, accountNumber, bankName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.refresh(), 1200);
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
        <h2 className="mt-2 font-bold text-green-800">Withdrawal requested!</h2>
        <p className="text-sm text-green-700">Pending admin approval. Amount held from balance.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-white p-6">
      {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <label className="mb-1 block text-sm font-semibold text-[#0a2e1c]">Amount (PKR)</label>
      <input
        className={input}
        type="number"
        step="0.01"
        placeholder={`Min ${minWithdrawal}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">Method</label>
      <select className={input} value={method} onChange={(e) => setMethod(e.target.value)}>
        {METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">Account Holder Name</label>
      <input className={input} value={accountName} onChange={(e) => setAccountName(e.target.value)} required />

      <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">
        {method === "bank" ? "Account Number / IBAN" : "Mobile / Account Number"}
      </label>
      <input
        className={input}
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
      />

      {method === "bank" && (
        <>
          <label className="mb-1 mt-4 block text-sm font-semibold text-[#0a2e1c]">Bank Name</label>
          <input className={input} value={bankName} onChange={(e) => setBankName(e.target.value)} />
        </>
      )}

      <button
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-[#0a2e1c] py-2.5 font-bold text-white hover:bg-[#12503a] disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Request Withdrawal"}
      </button>
    </form>
  );
}
