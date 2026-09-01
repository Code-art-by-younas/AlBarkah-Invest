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
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [screenshot, setScreenshot] = useState<string>(""); // ✅ base64 string
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    if (!selectedPlan || !selectedMethod || !screenshot) {
      toast.error("Please select a plan, payment method, and upload screenshot.");
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
          screenshot, // base64 string
          senderName: "", // optional
          transactionId: "", // optional
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Deposit request submitted! Waiting for admin approval.");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to submit deposit.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Selection */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="font-bold text-[#0a2e1c]">1. Choose Your Plan</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-lg border p-3 text-center transition ${
                selectedPlan === plan.id
                  ? "border-[#ffd700] bg-[#ffd700]/10"
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

      {/* Payment Method (Only OPay & others, but SadaPay removed from parent) */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="font-bold text-[#0a2e1c]">2. Select Payment Method</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`rounded-lg border p-3 text-center transition ${
                selectedMethod === method.id
                  ? "border-[#ffd700] bg-[#ffd700]/10"
                  : "border-gray-200 hover:border-[#ffd700]/50"
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <p className="mt-1 text-sm font-medium">{method.label}</p>
            </button>
          ))}
        </div>
        {selectedMethodData && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
            <p>
              <span className="font-medium">Account Name:</span>{" "}
              {selectedMethodData.accountName}
            </p>
            <p>
              <span className="font-medium">Account Number:</span>{" "}
              <span className="font-bold text-[#0a2e1c]">
                {selectedMethodData.accountNumber}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Screenshot Upload */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="font-bold text-[#0a2e1c]">3. Upload Payment Screenshot</h3>
        <div className="mt-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          />
          {screenshot && (
            <div className="mt-2">
              <img
                src={screenshot}
                alt="Screenshot preview"
                className="max-h-40 rounded-lg border"
              />
              <button
                type="button"
                onClick={() => setScreenshot("")}
                className="mt-1 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Upload a clear screenshot of your successful transaction (max 2MB).
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#ffd700] py-3 font-bold text-[#0a2e1c] transition hover:bg-[#e6c200] disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Deposit Request"}
      </button>
    </form>
  );
}
