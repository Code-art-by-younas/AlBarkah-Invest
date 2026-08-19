"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DepositRow({ depositId }: { depositId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function act(status: "approved" | "rejected") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/deposit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId, status, adminNote: note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-black/5 pt-4">
      {error && <div className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <input
        placeholder="Admin note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#0a2e1c]"
      />
      <div className="flex gap-3">
        <button
          onClick={() => act("approved")}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
        >
          Approve
        </button>
        <button
          onClick={() => act("rejected")}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
