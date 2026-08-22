import { db } from "@/db";
import { deposits, users, plans } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { DepositRow } from "./DepositRow";

export const dynamic = "force-dynamic";

export default async function AdminDepositsPage() {
  const allDeposits = await db
    .select({
      id: deposits.id,
      userId: deposits.userId,
      amount: deposits.amount,
      screenshot: deposits.screenshot,
      paymentMethod: deposits.paymentMethod,
      status: deposits.status,
      adminNote: deposits.adminNote,
      approvedAt: deposits.approvedAt,
      createdAt: deposits.createdAt,
      username: users.username,
      email: users.email,
      planName: plans.name,
    })
    .from(deposits)
    .leftJoin(users, eq(deposits.userId, users.id))
    .leftJoin(plans, eq(deposits.planId, plans.id))
    .orderBy(desc(deposits.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Deposits</h1>
        <span className="text-sm text-gray-500">
          {allDeposits.filter((d) => d.status === "pending").length} pending
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Method</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {allDeposits.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No deposits found.
                </td>
              </tr>
            ) : (
              allDeposits.map((deposit) => (
                <DepositRow key={deposit.id} deposit={deposit} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
