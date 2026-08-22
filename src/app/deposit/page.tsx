import { getPlans, getSettings } from "@/lib/data";
import { DepositForm } from "./DepositForm";

export const dynamic = "force-dynamic";

export default async function DepositPage() {
  const [plans, settings] = await Promise.all([getPlans(), getSettings()]);

  const plansData = plans.map((p) => ({
    id: p.id,
    name: p.name,
    amount: p.amount,
    dailyProfit: p.dailyProfit,
    totalProfit: p.totalProfit,
  }));

  // Payment methods array with details from settings
  const paymentMethods = [
    {
      id: "easypaisa",
      label: "Easypaisa",
      icon: "📱",
      accountName: settings.easypaisaName,
      accountNumber: settings.easypaisaNumber,
    },
    {
      id: "jazzcash",
      label: "Jazzcash",
      icon: "📱",
      accountName: settings.jazzcashName,
      accountNumber: settings.jazzcashNumber,
    },
    {
      id: "opay",
      label: "Opay",
      icon: "💳",
      accountName: settings.opayName,
      accountNumber: settings.opayNumber,
    },
    {
      id: "sadapay",
      label: "Sadapay",
      icon: "💳",
      accountName: settings.sadapayName,
      accountNumber: settings.sadapayNumber,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Make a Deposit</h1>
        <p className="text-sm text-black/60">
          Choose a plan, select payment method, then submit your payment proof for approval.
        </p>
      </div>

      {/* Payment Methods Selection */}
      <div className="rounded-2xl border border-[#ffd700]/50 bg-[#fffbe6] p-5">
        <h2 className="font-bold text-[#0a2e1c]">💳 Select Payment Method</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="rounded-lg bg-white p-3 text-center shadow-sm"
            >
              <span className="text-2xl">{method.icon}</span>
              <p className="mt-1 text-sm font-semibold text-[#0a2e1c]">
                {method.label}
              </p>
              <p className="text-xs text-black/50">{method.accountNumber}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-black/60">
          Transfer the exact plan amount to the selected method's account number, then upload the screenshot below.
        </p>
      </div>

      <DepositForm plans={plansData} paymentMethods={paymentMethods} />
    </div>
  );
}
