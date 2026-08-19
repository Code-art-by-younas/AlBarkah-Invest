import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { withdrawals, users, transactions } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

const schema = z.object({
  withdrawalId: z.string().uuid(),
  status: z.enum(["completed", "rejected"]),
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
    const { withdrawalId, status, adminNote } = parsed.data;

    const [w] = await db.select().from(withdrawals).where(eq(withdrawals.id, withdrawalId)).limit(1);
    if (!w) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (w.status !== "pending") {
      return NextResponse.json({ error: "Already processed" }, { status: 400 });
    }

    await db
      .update(withdrawals)
      .set({
        status,
        adminNote: adminNote ?? null,
        processedAt: new Date(),
      })
      .where(eq(withdrawals.id, withdrawalId));

    if (status === "rejected") {
      // refund held amount
      await db
        .update(users)
        .set({ balance: sql`${users.balance} + ${w.amount}` })
        .where(eq(users.id, w.userId));
    }

    await db
      .update(transactions)
      .set({ status: status === "completed" ? "completed" : "cancelled" })
      .where(and(eq(transactions.referenceId, withdrawalId), eq(transactions.type, "withdrawal")));

    if (status === "rejected") {
      await db.insert(transactions).values({
        userId: w.userId,
        type: "refund",
        amount: w.amount,
        description: "Withdrawal rejected — amount refunded",
        referenceId: withdrawalId,
        status: "completed",
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
