import { db } from "@/db";
import { plans, settings, users } from "@/db/schema";
import { asc, eq, or } from "drizzle-orm";
import { hashPassword, generateReferralCode } from "@/lib/auth";

export const PLANS_SEED = [
  { name: "Plan 1", amount: 290, dailyProfit: 29, totalProfit: 2610 },
  { name: "Plan 2", amount: 870, dailyProfit: 87, totalProfit: 7830 },
  { name: "Plan 3", amount: 1740, dailyProfit: 174, totalProfit: 15660 },
  { name: "Plan 4", amount: 3000, dailyProfit: 348, totalProfit: 31320 },
  { name: "Plan 5", amount: 6300, dailyProfit: 696, totalProfit: 62640 },
  { name: "Plan 6", amount: 12500, dailyProfit: 1392, totalProfit: 125280 },
  { name: "Plan 7", amount: 20000, dailyProfit: 2250, totalProfit: 202500 },
  { name: "Plan 8", amount: 25000, dailyProfit: 2784, totalProfit: 250560 },
  { name: "Plan 9", amount: 48000, dailyProfit: 5568, totalProfit: 501120 },
  { name: "Plan 10", amount: 100000, dailyProfit: 11136, totalProfit: 1002240 },
  { name: "Plan 11", amount: 145000, dailyProfit: 16000, totalProfit: 1440000 },
  { name: "Plan 12", amount: 190000, dailyProfit: 22000, totalProfit: 1980000 },
];

export async function ensureSeed() {
  const existing = await db.select().from(plans).limit(1);
  if (existing.length === 0) {
    await db.insert(plans).values(
      PLANS_SEED.map((p, i) => ({
        name: p.name,
        amount: String(p.amount),
        dailyProfit: String(p.dailyProfit),
        totalProfit: String(p.totalProfit),
        duration: 90,
        isActive: true,
        sortOrder: i,
      }))
    );
  }

  const s = await db.select().from(settings).limit(1);
  if (s.length === 0) {
    await db.insert(settings).values({});
  }

  await ensureAdmin();
}

export async function ensureAdmin() {
  // Aapke naye credentials
  const email = "mh0226738@gmail.com";
  const username = "admin";
  const password = "haseeb@126@";

  // Check if admin exists by email OR username
  const existing = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, email),
        eq(users.username, username)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing admin with new credentials
    const hashed = await hashPassword(password);
    await db
      .update(users)
      .set({
        email: email,
        username: username,
        password: hashed,
        role: "admin",
        status: "active",
      })
      .where(eq(users.id, existing[0].id));

    console.log("✅ Admin updated successfully!");
    return;
  }

  // Insert new admin if not exists
  const hashed = await hashPassword(password);
  await db.insert(users).values({
    username,
    email,
    password: hashed,
    referralCode: generateReferralCode(),
    role: "admin",
    status: "active",
  });

  console.log("✅ Admin created successfully!");
}

export async function getSettings() {
  await ensureSeed();
  const [s] = await db.select().from(settings).limit(1);
  return s;
}

export async function getPlans() {
  await ensureSeed();
  return db.select().from(plans).orderBy(asc(plans.sortOrder));
}