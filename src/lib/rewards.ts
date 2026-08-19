import { db } from "@/db";
import { userPlans, users, rewards, transactions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function processDailyRewards(): Promise<{ processed: number; credited: number }> {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const activePlans = await db.select().from(userPlans).where(eq(userPlans.status, "active"));

  let credited = 0;

  for (const plan of activePlans) {
    if (new Date(plan.endDate) < now) {
      await db.update(userPlans).set({ status: "completed" }).where(eq(userPlans.id, plan.id));
      continue;
    }
    if (new Date(plan.startDate) > now) continue;

    const existing = await db
      .select()
      .from(rewards)
      .where(and(eq(rewards.userPlanId, plan.id), eq(rewards.date, todayStr)))
      .limit(1);
    if (existing.length > 0) continue;

    await db.insert(rewards).values({
      userId: plan.userId,
      userPlanId: plan.id,
      amount: plan.dailyProfit,
      date: todayStr,
      status: "credited",
    });

    await db
      .update(users)
      .set({
        balance: sql`${users.balance} + ${plan.dailyProfit}`,
        totalEarned: sql`${users.totalEarned} + ${plan.dailyProfit}`,
      })
      .where(eq(users.id, plan.userId));

    await db
      .update(userPlans)
      .set({ totalEarned: sql`${userPlans.totalEarned} + ${plan.dailyProfit}` })
      .where(eq(userPlans.id, plan.id));

    await db.insert(transactions).values({
      userId: plan.userId,
      type: "reward",
      amount: plan.dailyProfit,
      description: `Daily profit for ${plan.amount} PKR plan`,
      referenceId: plan.id,
      status: "completed",
    });

    credited++;
  }

  return { processed: activePlans.length, credited };
}
