import { db } from "@/db";
import { users, referrals, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

type ReferralLevels = { level1: number; level2: number; level3: number; level4: number };

export async function processReferralCommissions(
  investorId: string,
  depositAmount: number,
  depositId: string,
  referralLevels: ReferralLevels
) {
  const [investor] = await db.select().from(users).where(eq(users.id, investorId)).limit(1);
  if (!investor || !investor.referredBy) return;

  const levels = [
    { level: 1, percent: referralLevels.level1 },
    { level: 2, percent: referralLevels.level2 },
    { level: 3, percent: referralLevels.level3 },
    { level: 4, percent: referralLevels.level4 },
  ];

  let currentId: string | null = investor.referredBy;

  for (const lvl of levels) {
    if (!currentId) break;
    const [referrer] = await db.select().from(users).where(eq(users.id, currentId)).limit(1);
    if (!referrer) break;

    const commission = (depositAmount * lvl.percent) / 100;

    await db
      .update(users)
      .set({
        balance: sql`${users.balance} + ${commission}`,
        totalEarned: sql`${users.totalEarned} + ${commission}`,
      })
      .where(eq(users.id, referrer.id));

    await db.insert(referrals).values({
      referrerId: referrer.id,
      referredId: investorId,
      level: lvl.level,
      commission: String(commission),
      status: "paid",
      paidAt: new Date(),
    });

    await db.insert(transactions).values({
      userId: referrer.id,
      type: "referral",
      amount: String(commission),
      description: `Level ${lvl.level} referral commission (${lvl.percent}%)`,
      referenceId: depositId,
      status: "completed",
    });

    currentId = referrer.referredBy;
  }
}
