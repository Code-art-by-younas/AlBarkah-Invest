import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, generateReferralCode } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Check username
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, validated.username))
      .limit(1);

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // ✅ WORKING FIX: Handle referral - ignore if invalid
    let referredById: string | null = null;

    if (validated.referralCode) {
      try {
        const referrer = await db
          .select()
          .from(users)
          .where(eq(users.referralCode, validated.referralCode))
          .limit(1);

        if (referrer.length > 0) {
          referredById = referrer[0].id;
        }
        // ✅ If invalid, just ignore and continue
      } catch (err) {
        console.log("Invalid referral code, continuing");
      }
    }

    // Create user
    const hashedPassword = await hashPassword(validated.password);
    const newReferralCode = generateReferralCode();

    const [newUser] = await db
      .insert(users)
      .values({
        username: validated.username,
        email: validated.email,
        password: hashedPassword,
        referralCode: newReferralCode,
        referredBy: referredById,
        role: "user",
        status: "active",
        balance: "0",
        totalEarned: "0",
        totalInvested: "0",
      })
      .returning();

    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
