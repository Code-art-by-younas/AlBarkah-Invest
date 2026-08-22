import { db } from "@/db";
import { plans, settings, users } from "@/db/schema";
import { asc, eq, or } from "drizzle-orm";
import { hashPassword, generateReferralCode } from "@/lib/auth";

// ✅ New 13 Plans as per client image
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
  // === Plans ===
  const existingPlans = await db.select().from(plans).limit(1);
  if (existingPlans.length === 0) {
    // Insert if no plans exist
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
  } else {
    // ✅ Update existing plans to new ones (in case old plans exist)
    // First delete all existing plans
    await db.delete(plans);
    // Then insert new plans
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
    console.log("✅ Plans updated to new 13 plans!");
  }

  // === Settings ===
  const existingSettings = await db.select().from(settings).limit(1);
  if (existingSettings.length === 0) {
    // Insert default settings
    await db.insert(settings).values({
      siteName: "AlBarkah Invest",
      siteLogo: null,
      opayName: "Muhammad Shahzad Pervaiz",
      opayNumber: "03320613270",
      easypaisaName: "Muhammad Shahzad Pervaiz",
      easypaisaNumber: "03320613270",
      jazzcashName: "Muhammad Shahzad Pervaiz",
      jazzcashNumber: "03320613270",
      sadapayName: "Muhammad Shahzad Pervaiz",
      sadapayNumber: "03320613270",
      minDeposit: "290",
      minWithdrawal: "29", // ✅ Updated to 29
      referralLevels: {
        level1: 11,
        level2: 3,
        level3: 2,
        level4: 1,
      }, // ✅ New referral levels
    });
  } else {
    // ✅ Update settings to ensure correct values
    await db
      .update(settings)
      .set({
        minWithdrawal: "29",
        referralLevels: {
          level1: 11,
          level2: 3,
          level3: 2,
          level4: 1,
        },
      })
      .where(eq(settings.id, existingSettings[0].id));
    console.log("✅ Settings updated: minWithdrawal=29, referral levels=11/3/2/1");
  }

  await ensureAdmin();
}

export async function ensureAdmin() {
  const email = "mh0226738@gmail.com";
  const username = "admin";
  const password = "haseeb@126@";

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
