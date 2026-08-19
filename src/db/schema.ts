import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: text("password").notNull(),
  referralCode: varchar("referral_code", { length: 20 }).unique().notNull(),
  referredBy: uuid("referred_by"),
  balance: numeric("balance", { precision: 20, scale: 2 }).default("0").notNull(),
  totalEarned: numeric("total_earned", { precision: 20, scale: 2 }).default("0").notNull(),
  totalInvested: numeric("total_invested", { precision: 20, scale: 2 }).default("0").notNull(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  dailyProfit: numeric("daily_profit", { precision: 20, scale: 2 }).notNull(),
  duration: integer("duration").default(90).notNull(),
  totalProfit: numeric("total_profit", { precision: 20, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPlans = pgTable("user_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: uuid("plan_id").references(() => plans.id).notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  dailyProfit: numeric("daily_profit", { precision: 20, scale: 2 }).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  totalEarned: numeric("total_earned", { precision: 20, scale: 2 }).default("0").notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deposits = pgTable("deposits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: uuid("plan_id").references(() => plans.id).notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  screenshot: text("screenshot").notNull(),
  senderName: varchar("sender_name", { length: 100 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  adminNote: text("admin_note"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull(),
  accountDetails: jsonb("account_details").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  adminNote: text("admin_note"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  userPlanId: uuid("user_plan_id").references(() => userPlans.id).notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).default("credited").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: uuid("referrer_id").references(() => users.id).notNull(),
  referredId: uuid("referred_id").references(() => users.id).notNull(),
  level: integer("level").notNull(),
  commission: numeric("commission", { precision: 20, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("completed").notNull(),
  referenceId: uuid("reference_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteName: varchar("site_name", { length: 100 }).default("AlBarkah Invest").notNull(),
  siteLogo: text("site_logo"),
  opayName: varchar("opay_name", { length: 100 }).default("Muhammad Shahzad Pervaiz").notNull(),
  opayNumber: varchar("opay_number", { length: 20 }).default("03320613270").notNull(),
  minDeposit: numeric("min_deposit", { precision: 20, scale: 2 }).default("290").notNull(),
  minWithdrawal: numeric("min_withdrawal", { precision: 20, scale: 2 }).default("30").notNull(),
  referralLevels: jsonb("referral_levels")
    .default({ level1: 11, level2: 4, level3: 3, level4: 2 })
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type UserPlan = typeof userPlans.$inferSelect;
export type Deposit = typeof deposits.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Settings = typeof settings.$inferSelect;
