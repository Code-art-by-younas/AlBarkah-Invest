import { getSession } from "@/lib/auth";
import { getPlans, getSettings } from "@/lib/data";
import { DepositForm } from "./DepositForm";
import { UserShell } from "@/components/UserShell";

export const dynamic = "force-dynamic";

export default async function DepositPage() {
  const [session, plans, settings] = await Promise.all([
    getSession(),
    getPlans(),
    getSettings(),
  ]);

  const plansData = plans.map((p) => ({
    id: p.id,
    name: p.name,
    amount: p.amount,
    dailyProfit: p.dailyProfit,
    totalProfit: p.totalProfit,
  }));

  // ✅ Settings se payment methods banao
  const paymentMethods = [
    {
      id: "opay",
      label: "OPay",
      icon: "💳",
      accountName: settings.opayName,
      accountNumber: settings.opayNumber,
    },
    {
      id: "easypaisa",
      label: "Easypaisa",
      icon: "📱",
      accountName: settings.easypaisaName,
      accountNumber: settings.easypaisaNumber,
    },
    {
      id: "jazzcash",
      label: "JazzCash",
      icon: "📲",
      accountName: settings.jazzcashName,
      accountNumber: settings.jazzcashNumber,
    },
    {
      id: "sadapay",
      label: "SadaPay",
      icon: "💠",
      accountName: settings.sadapayName,
      accountNumber: settings.sadapayNumber,
    },
  ];

  return (
    <UserShell username={session?.username ?? "Guest"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Make a Deposit</h1>
          <p className="text-sm text-black/60">
            Choose a payment method, then submit your payment proof for approval.
          </p>
        </div>

        <DepositForm plans={plansData} paymentMethods={paymentMethods} />
      </div>
    </UserShell>
  );
}
