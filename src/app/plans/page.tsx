import Link from "next/link";
import { getPlans } from "@/lib/data";
import { formatPKR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Investment Plans</h1>
        <p className="text-sm text-black/60">
          Choose a plan and deposit to start earning daily for 90 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0a2e1c]">{p.name}</h3>
              <span className="rounded-full bg-[#0a2e1c]/5 px-2 py-1 text-xs font-semibold text-[#0a2e1c]">
                90 days
              </span>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#0a2e1c]">
              {formatPKR(p.amount)}
            </div>
            <div className="mt-4 space-y-1 text-sm text-black/70">
              <div className="flex justify-between">
                <span>Daily Profit</span>
                <span className="font-semibold text-[#c9a227]">
                  {formatPKR(p.dailyProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Return (90 days)</span>
                <span className="font-semibold text-[#0a2e1c]">
                  {formatPKR(p.totalProfit)}
                </span>
              </div>
            </div>
            <Link
              href={`/deposit?plan=${p.id}`}
              className="mt-6 rounded-xl bg-[#0a2e1c] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#12503a]"
            >
              Invest Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
