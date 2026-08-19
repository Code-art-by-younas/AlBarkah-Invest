import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, referrals } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getSettings } from "@/lib/data";
import { formatPKR, formatDate } from "@/lib/format";
import { ReferralShare } from "./ReferralShare";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user] = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
  const settings = await getSettings();
  const levels = settings.referralLevels as { level1: number; level2: number; level3: number; level4: number };

  const myReferrals = await db
    .select({
      id: referrals.id,
      level: referrals.level,
      commission: referrals.commission,
      createdAt: referrals.createdAt,
      username: users.username,
    })
    .from(referrals)
    .leftJoin(users, eq(referrals.referredId, users.id))
    .where(eq(referrals.referrerId, session.id))
    .orderBy(desc(referrals.createdAt))
    .limit(50);

  const [agg] = await db
    .select({
      total: sql<string>`coalesce(sum(${referrals.commission}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(referrals)
    .where(eq(referrals.referrerId, session.id));

  // direct recruits (level 1)
  const directCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.referredBy, session.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Referral Program</h1>
        <p className="text-sm text-black/60">
          Earn commissions across 4 levels when your team invests.
        </p>
      </div>

      <ReferralShare code={user.referralCode} />

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-black/5 bg-white p-4 text-center">
          <div className="text-xs text-black/50">Total Commission</div>
          <div className="text-lg font-extrabold text-[#c9a227]">{formatPKR(agg.total)}</div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 text-center">
          <div className="text-xs text-black/50">Direct Referrals</div>
          <div className="text-lg font-extrabold text-[#0a2e1c]">{directCount[0]?.count ?? 0}</div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 text-center">
          <div className="text-xs text-black/50">Payouts</div>
          <div className="text-lg font-extrabold text-[#0a2e1c]">{agg.count}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold text-[#0a2e1c]">Commission Rates</h2>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          {[levels.level1, levels.level2, levels.level3, levels.level4].map((v, i) => (
            <div key={i} className="rounded-xl bg-[#f5f5f5] p-3">
              <div className="text-xs text-black/50">Level {i + 1}</div>
              <div className="font-extrabold text-[#0a2e1c]">{v}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="mb-3 font-bold text-[#0a2e1c]">Commission History</h2>
        {myReferrals.length === 0 ? (
          <p className="py-6 text-center text-sm text-black/50">No commissions yet.</p>
        ) : (
          <div className="space-y-2">
            {myReferrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-black/5 bg-[#f5f5f5] p-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-[#0a2e1c]">
                    {r.username ?? "User"}{" "}
                    <span className="rounded-full bg-[#0a2e1c]/10 px-2 py-0.5 text-xs">
                      L{r.level}
                    </span>
                  </div>
                  <div className="text-xs text-black/50">{formatDate(r.createdAt)}</div>
                </div>
                <div className="font-bold text-green-700">+{formatPKR(r.commission)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
