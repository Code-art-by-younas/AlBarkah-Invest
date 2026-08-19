import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, userPlans, transactions, plans, deposits, withdrawals, referrals } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { AccountSummary } from "@/components/dashboard/AccountSummary";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Session expired. Please login again.</p>
          <a href="/login" className="mt-4 inline-block text-[#ffd700] hover:underline">
            Go to Login →
          </a>
        </div>
      </div>
    );
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.id))
    .limit(1);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">User not found.</p>
          <a href="/logout" className="mt-4 inline-block text-[#ffd700] hover:underline">
            Logout →
          </a>
        </div>
      </div>
    );
  }

  // Active plans
  const activePlans = await db
    .select({
      id: userPlans.id,
      planId: userPlans.planId,
      amount: userPlans.amount,
      dailyProfit: userPlans.dailyProfit,
      totalEarned: userPlans.totalEarned,
      startDate: userPlans.startDate,
      endDate: userPlans.endDate,
      status: userPlans.status,
      planName: plans.name,
    })
    .from(userPlans)
    .leftJoin(plans, eq(userPlans.planId, plans.id))
    .where(
      and(
        eq(userPlans.userId, session.id),
        eq(userPlans.status, "active")
      )
    )
    .orderBy(desc(userPlans.createdAt));

  // Recent transactions
  const recentTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.id))
    .orderBy(desc(transactions.createdAt))
    .limit(10);

  const totalInvested = activePlans.reduce(
    (sum, plan) => sum + Number(plan.amount),
    0
  );

  // Today's earning
  const today = new Date();
  today.setHours(today.getHours() - 24);
  const todayEarnings = await db
    .select({
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.id),
        eq(transactions.type, "reward"),
        sql`${transactions.createdAt} >= ${today}`
      )
    );
  const todayEarning = todayEarnings[0]?.total || 0;

  // ===== ACCOUNT SUMMARY DATA =====

  // Total Withdrawn
  const withdrawnResult = await db
    .select({
      total: sql<number>`SUM(${withdrawals.amount})`,
    })
    .from(withdrawals)
    .where(
      and(
        eq(withdrawals.userId, session.id),
        eq(withdrawals.status, "completed")
      )
    );
  const totalWithdrawn = withdrawnResult[0]?.total || 0;

  // Total Payout (total earned from all sources)
  const payoutResult = await db
    .select({
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.id),
        sql`${transactions.amount} > 0`
      )
    );
  const totalPayout = payoutResult[0]?.total || 0;

  // Total Referral Bonus
  const referralResult = await db
    .select({
      total: sql<number>`SUM(${referrals.commission})`,
    })
    .from(referrals)
    .where(
      and(
        eq(referrals.referrerId, session.id),
        eq(referrals.status, "paid")
      )
    );
  const totalReferral = referralResult[0]?.total || 0;

  // Pending Deposit
  const pendingDepositResult = await db
    .select({
      total: sql<number>`SUM(${deposits.amount})`,
    })
    .from(deposits)
    .where(
      and(
        eq(deposits.userId, session.id),
        eq(deposits.status, "pending")
      )
    );
  const pendingDeposit = pendingDepositResult[0]?.total || 0;

  // Pending Withdrawal
  const pendingWithdrawalResult = await db
    .select({
      total: sql<number>`SUM(${withdrawals.amount})`,
    })
    .from(withdrawals)
    .where(
      and(
        eq(withdrawals.userId, session.id),
        eq(withdrawals.status, "pending")
      )
    );
  const pendingWithdrawal = pendingWithdrawalResult[0]?.total || 0;

  // Team Count (direct referrals)
  const teamCountResult = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .where(eq(users.referredBy, session.id));
  const teamCount = teamCountResult[0]?.count || 0;

  // Team Invest
  const teamInvestResult = await db
    .select({
      total: sql<number>`SUM(${userPlans.amount})`,
    })
    .from(userPlans)
    .innerJoin(users, eq(userPlans.userId, users.id))
    .where(eq(users.referredBy, session.id));
  const teamInvest = teamInvestResult[0]?.total || 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit": return "text-green-600";
      case "withdrawal": return "text-red-500";
      case "reward": return "text-[#ffd700]";
      case "referral": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit": return "⬇️";
      case "withdrawal": return "⬆️";
      case "reward": return "⭐";
      case "referral": return "👥";
      default: return "📝";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a2e1c]">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user.username}! 👋</p>
        </div>
        <div className="rounded-lg bg-[#ffd700]/10 px-4 py-2 text-center">
          <p className="text-xs text-gray-500">Today's Earnings</p>
          <p className="text-xl font-bold text-[#0a2e1c]">
            +{Number(todayEarning).toFixed(2)} PKR
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-xl font-bold text-[#0a2e1c]">
            {Number(user.balance).toFixed(0)} PKR
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Invested</p>
          <p className="text-xl font-bold text-[#0a2e1c]">
            {totalInvested.toFixed(0)} PKR
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Plans</p>
          <p className="text-xl font-bold text-[#0a2e1c]">
            {activePlans.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-xl font-bold text-[#0a2e1c]">
            {Number(user.totalEarned).toFixed(0)} PKR
          </p>
        </div>
      </div>

      {/* Active Plans */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0a2e1c]">Active Plans 🚀</h2>
          <span className="text-sm text-gray-500">{activePlans.length} active</span>
        </div>
        {activePlans.length > 0 ? (
          <div className="space-y-3">
            {activePlans.map((plan) => {
              const remainingDays = Math.ceil(
                (new Date(plan.endDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={plan.id}
                  className="flex flex-col gap-2 rounded-lg border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#0a2e1c]">{plan.planName}</p>
                    <p className="text-sm text-gray-500">
                      {Number(plan.amount).toFixed(0)} PKR • Daily:{" "}
                      {Number(plan.dailyProfit).toFixed(0)} PKR
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Earned</p>
                      <p className="font-semibold text-[#ffd700]">
                        {Number(plan.totalEarned).toFixed(0)} PKR
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Remaining</p>
                      <p className="font-semibold text-[#0a2e1c]">
                        {remainingDays > 0 ? `${remainingDays} days` : "✅ Done"}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {plan.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No active plans</p>
            <a href="/plans" className="mt-2 inline-block text-[#ffd700] hover:underline">
              Invest Now →
            </a>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0a2e1c]">Recent Transactions 📋</h2>
          <a href="/transactions" className="text-sm text-[#ffd700] hover:underline">
            View All
          </a>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-gray-50 p-3 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getTypeIcon(tx.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-[#0a2e1c]">
                      {tx.description || tx.type}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(tx.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTypeColor(tx.type)}`}>
                    {Number(tx.amount) > 0 ? "+" : ""}
                    {Number(tx.amount).toFixed(0)} PKR
                  </p>
                  <span className={`text-xs ${tx.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500">No transactions yet</p>
        )}
      </div>

      {/* ===== ACCOUNT SUMMARY (Now Below Recent Transactions) ===== */}
      <AccountSummary
        totalInvested={totalInvested}
        totalWithdrawn={totalWithdrawn}
        totalPayout={totalPayout}
        totalReferral={totalReferral}
        pendingDeposit={pendingDeposit}
        pendingWithdrawal={pendingWithdrawal}
        teamCount={teamCount}
        teamInvest={teamInvest}
      />
    </div>
  );
}