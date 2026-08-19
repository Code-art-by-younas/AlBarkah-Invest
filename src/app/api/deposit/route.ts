import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { deposits, plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

const schema = z.object({
  planId: z.string().uuid(),
  screenshot: z.string().min(10),
  senderName: z.string().max(100).optional(),
  transactionId: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
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

    // limit screenshot size roughly (~2MB base64)
    if (screenshot.length > 3_000_000) {
      return NextResponse.json({ error: "Screenshot too large (max ~2MB)" }, { status: 400 });
    }

    const [deposit] = await db
      .insert(deposits)
      .values({
        userId: session.id,
        planId,
        amount: plan.amount,
        screenshot,
        senderName: senderName ?? null,
        transactionId: transactionId ?? null,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ success: true, depositId: deposit.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
