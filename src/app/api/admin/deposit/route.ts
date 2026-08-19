import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { deposits, userPlans, users, plans, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { processReferralCommissions } from "@/lib/referral";

const schema = z.object({
  depositId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
  adminNote: z.string().max(500).optional(),
});

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { depositId, status, adminNote } = parsed.data;

    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, depositId)).limit(1);
    if (!deposit) return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    if (deposit.status !== "pending") {
      return NextResponse.json({ error: "Deposit already processed" }, { status: 400 });
    }

    await db
      .update(deposits)
      .set({
        status,
        adminNote: adminNote ?? null,
        approvedAt: status === "approved" ? new Date() : null,
      })
      .where(eq(deposits.id, depositId));

    if (status === "approved") {
      const [plan] = await db.select().from(plans).where(eq(plans.id, deposit.planId)).limit(1);
      const dailyProfit = plan ? plan.dailyProfit : "0";

      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + (plan?.duration ?? 90));

      await db.insert(userPlans).values({
        userId: deposit.userId,
        planId: deposit.planId,
        amount: deposit.amount,
        dailyProfit,
        startDate: start,
        endDate: end,
        status: "active",
      });

      await db
        .update(users)
        .set({ totalInvested: sql`${users.totalInvested} + ${deposit.amount}` })
        .where(eq(users.id, deposit.userId));

      await db.insert(transactions).values({
        userId: deposit.userId,
        type: "deposit",
        amount: deposit.amount,
        description: `Deposit approved (${plan?.name ?? "Plan"})`,
        referenceId: depositId,
        status: "completed",
      });

      const settings = await getSettings();
      const levels = settings.referralLevels as {
        level1: number;
        level2: number;
        level3: number;
        level4: number;
      };
      await processReferralCommissions(
        deposit.userId,
        parseFloat(deposit.amount),
        depositId,
        levels
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
