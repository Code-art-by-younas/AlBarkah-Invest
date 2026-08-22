import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET Settings
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [setting] = await db.select().from(settings).limit(1);
    return NextResponse.json(setting || {});
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PUT Update Settings
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const [existing] = await db.select().from(settings).limit(1);
    
    if (existing) {
      await db.update(settings).set({
        ...body,
        updatedAt: new Date(),
      }).where(eq(settings.id, existing.id));
    } else {
      await db.insert(settings).values({
        ...body,
      });
    }

    const [updated] = await db.select().from(settings).limit(1);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
