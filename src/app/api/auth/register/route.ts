import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword, createSession, generateReferralCode } from "@/lib/auth";
import { ensureSeed } from "@/lib/data";

const schema = z
  .object({
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore"),
    email: z.string().email().max(100),
    password: z.string().min(6),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    await ensureSeed();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { username, email, password, referralCode } = parsed.data;

    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email.toLowerCase())))
      .limit(1);
    if (existing.length > 0) {
      const taken = existing[0].email === email.toLowerCase() ? "Email" : "Username";
      return NextResponse.json({ error: `${taken} already in use` }, { status: 409 });
    }

    let referredBy: string | null = null;
    if (referralCode && referralCode.trim()) {
      const [ref] = await db
        .select()
        .from(users)
        .where(eq(users.referralCode, referralCode.trim().toUpperCase()))
        .limit(1);
      if (!ref) {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
      }
      referredBy = ref.id;
    }

    let code = generateReferralCode();
    for (let i = 0; i < 5; i++) {
      const dup = await db.select().from(users).where(eq(users.referralCode, code)).limit(1);
      if (dup.length === 0) break;
      code = generateReferralCode();
    }

    const hashed = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        username,
        email: email.toLowerCase(),
        password: hashed,
        referralCode: code,
        referredBy,
      })
      .returning();

    await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
