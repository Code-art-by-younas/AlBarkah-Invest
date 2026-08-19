import Link from "next/link";
import { db } from "@/db";
import { users, deposits, withdrawals, userPlans } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { formatPKR } from "@/lib/format";
import { ensureSeed } from "@/lib/data";
import { RunRewardsButton } from "./RunRewardsButton";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await ensureSeed();

  const [userCount] = await db.select({ c: sql<number>`count(*)` }).from(users).where(eq(users.role, "user"));
  const [pendingDep] = await db
    .select({ c: sql<number>`count(*)` })
    .from(deposits)
    .where(eq(deposits.status, "pending"));
  const [pendingWd] = await db
    .select({ c: sql<number>`count(*)` })
    .from(withdrawals)
    .where(eq(withdrawals.status, "pending"));
  const [invested] = await db
    .select({ s: sql<string>`coalesce(sum(${userPlans.amount}), 0)` })
    .from(userPlans);
  const [balances] = await db
    .select({ s: sql<string>`coalesce(sum(${users.balance}), 0)` })
    .from(users);
  const [activeP] = await db
    .select({ c: sql<number>`count(*)` })
    .from(userPlans)
    .where(eq(userPlans.status, "active"));

  const cards = [
    { title: "Total Users", value: String(userCount.c), icon: "👥" },
    { title: "Active Plans", value: String(activeP.c), icon: "📊" },
    { title: "Total Invested", value: formatPKR(invested.s), icon: "📈" },
    { title: "User Balances", value: formatPKR(balances.s), icon: "💰" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Admin Overview</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-black/5 bg-white p-4">
            <div className="text-2xl">{c.icon}</div>
            <div className="mt-2 text-xs text-black/50">{c.title}</div>
            <div className="text-lg font-extrabold text-[#0a2e1c]">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/deposits"
          className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 hover:shadow-md"
        >
          <div>
            <div className="font-bold text-[#0a2e1c]">Pending Deposits</div>
            <div className="text-sm text-black/50">Review & approve payments</div>
          </div>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
            {pendingDep.c}
          </span>
        </Link>
        <Link
          href="/admin/withdrawals"
          className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 hover:shadow-md"
        >
          <div>
            <div className="font-bold text-[#0a2e1c]">Pending Withdrawals</div>
            <div className="text-sm text-black/50">Process payout requests</div>
          </div>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
            {pendingWd.c}
          </span>
        </Link>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="font-bold text-[#0a2e1c]">Daily Rewards</h2>
        <p className="mt-1 text-sm text-black/60">
          Credit today&apos;s profit to all active investment plans. In production this runs
          automatically via a cron job hitting <code className="rounded bg-[#f5f5f5] px-1">/api/cron/daily-rewards</code>.
        </p>
        <div className="mt-3">
          <RunRewardsButton />
        </div>
      </div>
    </div>
  );
}
