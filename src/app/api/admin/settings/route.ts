import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { settings, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// ✅ GET Settings
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let [setting] = await db.select().from(settings).limit(1);

    // If no settings exist, return defaults
    if (!setting) {
      return NextResponse.json({
        siteName: "AlBarkah Invest",
        siteLogo: null,
        opayName: "Muhammad Shahzad Pervaiz",
        opayNumber: "03320613270",
        sadapayName: "Muhammad Shahzad Pervaiz",
        sadapayNumber: "03320613270",
        minDeposit: "290",
        minWithdrawal: "29",
        referralLevels: { level1: 11, level2: 3, level3: 2, level4: 1 },
      });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

// ✅ PUT Update Settings
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const [existing] = await db.select().from(settings).limit(1);

    if (existing) {
      await db
        .update(settings)
        .set({
          siteName: body.siteName,
          siteLogo: body.siteLogo,
          opayName: body.opayName,
          opayNumber: body.opayNumber,
          sadapayName: body.sadapayName,
          sadapayNumber: body.sadapayNumber,
          minDeposit: body.minDeposit,
          minWithdrawal: body.minWithdrawal,
          referralLevels: body.referralLevels || { level1: 11, level2: 3, level3: 2, level4: 1 },
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existing.id));
    } else {
      await db.insert(settings).values({
        siteName: body.siteName || "AlBarkah Invest",
        siteLogo: body.siteLogo || null,
        opayName: body.opayName || "Muhammad Shahzad Pervaiz",
        opayNumber: body.opayNumber || "03320613270",
        sadapayName: body.sadapayName || "Muhammad Shahzad Pervaiz",
        sadapayNumber: body.sadapayNumber || "03320613270",
        minDeposit: body.minDeposit || "290",
        minWithdrawal: body.minWithdrawal || "29",
        referralLevels: body.referralLevels || { level1: 11, level2: 3, level3: 2, level4: 1 },
        updatedAt: new Date(),
      });
    }

    const [updated] = await db.select().from(settings).limit(1);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
