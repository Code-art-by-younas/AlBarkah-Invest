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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Make a Deposit</h1>
        <p className="text-sm text-black/60">Pay via OPay, then submit your payment proof for approval.</p>
      </div>

      <div className="rounded-2xl border border-[#ffd700]/50 bg-[#fffbe6] p-5">
        <h2 className="font-bold text-[#0a2e1c]">💳 OPay Payment Details</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-black/50">Account Name</div>
            <div className="font-bold text-[#0a2e1c]">{settings.opayName}</div>
          </div>
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-black/50">OPay Number</div>
            <div className="font-bold text-[#0a2e1c]">{settings.opayNumber}</div>
          </div>
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-black/50">Min Deposit</div>
            <div className="font-bold text-[#0a2e1c]">{settings.minDeposit} PKR</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-black/60">
          Transfer the exact plan amount to the OPay number above, take a screenshot of the successful
          transaction, then submit it below.
        </p>
      </div>

      <DepositForm plans={plansData} />
    </div>
  );
}
