import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";

const schema = z.object({
  opayName: z.string().min(1).max(100),
  opayNumber: z.string().min(1).max(20),
  minDeposit: z.number().nonnegative(),
  minWithdrawal: z.number().nonnegative(),
  level1: z.number().min(0).max(100),
  level2: z.number().min(0).max(100),
  level3: z.number().min(0).max(100),
  level4: z.number().min(0).max(100),
});

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const current = await getSettings();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const d = parsed.data;

    await db
      .update(settings)
      .set({
        opayName: d.opayName,
        opayNumber: d.opayNumber,
        minDeposit: String(d.minDeposit),
        minWithdrawal: String(d.minWithdrawal),
        referralLevels: { level1: d.level1, level2: d.level2, level3: d.level3, level4: d.level4 },
        updatedAt: new Date(),
      })
      .where(eq(settings.id, current.id));

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
