"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  amount: string;
  dailyProfit: string;
  totalProfit: string;
}

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
  accountName: string;
  accountNumber: string;
}

export function DepositForm({
  plans,
  paymentMethods,
}: {
  plans: Plan[];
  paymentMethods: PaymentMethod[];
}) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>(
    paymentMethods[0]?.id ?? ""
  );
  const [senderName, setSenderName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshot(reader.result as string);
      toast.success("Screenshot loaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!screenshot) {
      toast.error("Please upload a payment screenshot");
      return;
    }
    if (!senderName.trim()) {
      toast.error("Please enter sender name");
      return;
    }
    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          method: selectedMethod,
          screenshot,
          senderName: senderName.trim(),
          transactionId: transactionId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Deposit submitted! Waiting for admin approval.");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Deposit error:", err);
      toast.error("Failed to submit deposit.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod);

  if (plans.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">No active plans available. Please check back later.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ===== 1. Plan Selection ===== */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-bold text-[#0a2e1c]">1. Choose Your Plan</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-lg border p-3 text-center transition ${
                selectedPlan === plan.id
                  ? "border-[#ffd700] bg-[#ffd700]/10 ring-2 ring-[#ffd700]/40"
                  : "border-gray-200 hover:border-[#ffd700]/50"
              }`}
            >
              <p className="text-sm font-semibold text-[#0a2e1c]">{plan.name}</p>
              <p className="text-lg font-bold text-[#0a2e1c]">
                {Number(plan.amount).toFixed(0)} PKR
              </p>
              <p className="text-xs text-gray-500">
                Daily: {Number(plan.dailyProfit).toFixed(0)} PKR
              </p>
            </button>
          ))}
        </div>
        {selectedPlanData && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
            <p>
              <span className="font-medium">Total Return:</span>{" "}
              {Number(selectedPlanData.totalProfit).toFixed(0)} PKR (90 days)
            </p>
          </div>
        )}
      </div>

      {/* ===== 2. Payment Method (Sirf OPay) ===== */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-bold text-[#0a2e1c]">2. Payment Method</h3>

        <div className="rounded-xl border-2 border-[#0a2e1c]/10 bg-[#0a2e1c]/5 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a2e1c] text-lg text-white">
              💳
            </span>
            <div>
              <p className="font-bold text-[#0a2e1c]">OPay</p>
              <p className="text-xs text-gray-600">
                Send payment to the account below
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 rounded-lg bg-white p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Account Name</span>
              <span className="font-semibold text-[#0a2e1c]">
                {paymentMethods[0]?.accountName ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Account Number</span>
              <span className="font-mono font-bold text-[#0a2e1c]">
                {paymentMethods[0]?.accountNumber ?? "—"}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-black/60">
            Transfer the exact plan amount to this OPay number, then upload your screenshot below.
          </p>
        </div>

        {paymentMethods.length === 0 && (
          <p className="mt-3 text-sm text-red-600">
            Payment method not configured. Please contact support.
          </p>
        )}
      </div>

      {/* ===== 3. Transaction Details ===== */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold text-[#0a2e1c]">3. Transaction Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0a2e1c]">
              Sender Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Muhammad Ali"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#ffd700]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0a2e1c]">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 1029384756"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#ffd700]"
              required
            />
          </div>
        </div>
      </div>

      {/* ===== 4. Screenshot Upload ===== */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-bold text-[#0a2e1c]">4. Upload Payment Screenshot</h3>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-[#ffd700]">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-3xl">📷</span>
          <span className="mt-2 text-sm font-medium text-[#0a2e1c]">
            Click to upload screenshot
          </span>
          <span className="mt-1 text-xs text-gray-500">
            PNG, JPG (max 2MB)
          </span>
        </label>

        {screenshot && (
          <div className="mt-3">
            <img
              src={screenshot}
              alt="Screenshot preview"
              className="max-h-48 rounded-lg border"
            />
            <button
              type="button"
              onClick={() => setScreenshot("")}
              className="mt-2 text-xs font-medium text-red-600 hover:underline"
            >
              ✕ Remove Screenshot
            </button>
          </div>
        )}
      </div>

      {/* ===== Submit ===== */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#ffd700] py-3 font-bold text-[#0a2e1c] transition hover:bg-[#e6c200] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Deposit Request"}
      </button>
    </form>
  );
}
