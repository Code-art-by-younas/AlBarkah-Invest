"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: params.get("ref") ?? "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-[#0a2e1c] focus:ring-2 focus:ring-[#0a2e1c]/10";

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <input
        className={input}
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        className={input}
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        className={input}
        type="password"
        placeholder="Password (min 6 chars)"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <input
        className={input}
        type="password"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        required
      />
      <input
        className={input}
        placeholder="Referral code (optional)"
        value={form.referralCode}
        onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
      />
      <button
        disabled={loading}
        className="w-full rounded-lg bg-[#0a2e1c] py-2.5 font-bold text-white hover:bg-[#12503a] disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
