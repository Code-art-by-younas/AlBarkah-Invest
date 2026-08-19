import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function TransactionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let rows = [];
  let error = null;

  try {
    rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, session.id))
      .orderBy(desc(transactions.createdAt))
      .limit(200);
  } catch (err) {
    error = "Failed to load transactions. Please refresh the page.";
    console.error("Transactions DB error:", err);
  }

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
      <div>
        <h1 className="text-2xl font-bold text-[#0a2e1c]">Transaction History</h1>
        <p className="text-sm text-gray-500">View all your deposits, withdrawals, and rewards</p>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 p-4 text-center text-red-600">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-[#ffd700] hover:underline"
          >
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500">
          No transactions yet.
          <a href="/deposit" className="ml-2 text-[#ffd700] hover:underline">
            Make a deposit
          </a>
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">Description</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Amount</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(tx.type)}</span>
                      <span className="capitalize text-gray-700">{tx.type}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{tx.description || "-"}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${getTypeColor(tx.type)}`}>
                    {Number(tx.amount) > 0 ? "+" : ""}
                    {Number(tx.amount).toFixed(0)} PKR
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">
                    {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}