import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { withdrawals, users, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";

const schema = z.object({
  amount: z.number().positive(),
  method: z.enum(["easypaisa", "jazzcash", "sadapay", "opay", "bank"]),
  accountName: z.string().min(1).max(100),
  accountNumber: z.string().min(1).max(50),
  bankName: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await getSettings();
    const minW = parseFloat(settings.minWithdrawal);
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { amount, method, accountName, accountNumber, bankName } = parsed.data;

    if (amount < minW) {
      return NextResponse.json(
        { error: `Minimum withdrawal is ${minW} PKR` },
        { status: 400 }
      );
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
    if (parseFloat(user.balance) < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const [withdrawal] = await db
      .insert(withdrawals)
      .values({
        userId: session.id,
        amount: String(amount),
        method,
        accountDetails: { accountName, accountNumber, bankName: bankName ?? null },
        status: "pending",
      })
      .returning();

    // Deduct immediately (held), refund if rejected
    await db
      .update(users)
      .set({ balance: sql`${users.balance} - ${amount}` })
      .where(eq(users.id, session.id));

    await db.insert(transactions).values({
      userId: session.id,
      type: "withdrawal",
      amount: String(-amount),
      description: `Withdrawal request via ${method}`,
      referenceId: withdrawal.id,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
