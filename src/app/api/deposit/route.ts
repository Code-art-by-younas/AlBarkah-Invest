import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { deposits, plans, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

const schema = z.object({
  planId: z.string().uuid(),
  method: z.string().optional(),
  screenshot: z.string().min(10),
  senderName: z.string().max(100).optional(),
  transactionId: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }
    const { planId, screenshot, senderName, transactionId } = parsed.data;

    const [plan] = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (screenshot.length > 3_000_000) {
      return NextResponse.json({ error: "Screenshot too large (max ~2MB)" }, { status: 400 });
    }

    const [deposit] = await db
      .insert(deposits)
      .values({
        userId: session.user.id,
        planId,
        amount: plan.amount,
        screenshot,
        senderName: senderName ?? null,
        transactionId: transactionId ?? null,
        status: "pending",
      })
      .returning();

    await db.insert(transactions).values({
      userId: session.user.id,
      type: "deposit",
      amount: plan.amount,
      description: `Deposit request - ${plan.amount} PKR - Pending`,
      status: "pending",
      referenceId: deposit.id,
    });

    return NextResponse.json({ success: true, depositId: deposit.id });
  } catch (error) {
    console.error("Deposit API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
