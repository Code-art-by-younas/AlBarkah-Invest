import { db } from "@/db";
import { plans, settings, users } from "@/db/schema";
import { asc, eq, or } from "drizzle-orm";
import { hashPassword, generateReferralCode } from "@/lib/auth";

export const PLANS_SEED = [
  { name: "Plan 01", amount: 320, dailyProfit: 64, totalProfit: 5760 },
  { name: "Plan 02", amount: 870, dailyProfit: 174, totalProfit: 15660 },
  { name: "Plan 03", amount: 1470, dailyProfit: 294, totalProfit: 26460 },
  { name: "Plan 04", amount: 3270, dailyProfit: 654, totalProfit: 58860 },
  { name: "Plan 05", amount: 6270, dailyProfit: 1254, totalProfit: 112860 },
  { name: "Plan 06", amount: 14770, dailyProfit: 2954, totalProfit: 265860 },
  { name: "Plan 07", amount: 21770, dailyProfit: 4354, totalProfit: 391860 },
  { name: "Plan 08", amount: 46770, dailyProfit: 9354, totalProfit: 841860 },
  { name: "Plan 09", amount: 72770, dailyProfit: 14554, totalProfit: 1309860 },
  { name: "Plan 10", amount: 96770, dailyProfit: 19354, totalProfit: 1741860 },
  { name: "Plan 11", amount: 145770, dailyProfit: 29154, totalProfit: 2623860 },
  { name: "Plan 12", amount: 245770, dailyProfit: 49154, totalProfit: 4423860 },
  { name: "Plan 13", amount: 445770, dailyProfit: 95570, totalProfit: 8601300 },
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
