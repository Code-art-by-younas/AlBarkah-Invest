import { NextResponse } from "next/server";
import { processDailyRewards } from "@/lib/rewards";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function authorize(req: Request): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (secret && authHeader === `Bearer ${secret}`) return true;
  const session = await getSession();
  return !!session && session.role === "admin";
}

export async function POST(req: Request) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await processDailyRewards();
  return NextResponse.json({ success: true, ...result });
}

export async function GET(req: Request) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await processDailyRewards();
  return NextResponse.json({ success: true, ...result });
}
