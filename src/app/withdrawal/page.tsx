import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, withdrawals } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSettings } from "@/lib/data";
import { formatPKR, formatDate } from "@/lib/format";
import { WithdrawalForm } from "./WithdrawalForm";

export const dynamic = "force-dynamic";

export default async function WithdrawalPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user] = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
  const settings = await getSettings();
  const history = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.userId, session.id))
    .orderBy(desc(withdrawals.createdAt))
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Withdraw Funds</h1>
        <p className="text-sm text-black/60">
          Available balance:{" "}
          <span className="font-bold text-[#0a2e1c]">{formatPKR(user.balance)}</span>
        </p>
      </div>

      <WithdrawalForm
        balance={user.balance}
        minWithdrawal={settings.minWithdrawal}
      />

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="mb-4 font-bold text-[#0a2e1c]">Withdrawal History</h2>
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-black/50">No withdrawals yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-xl border border-black/5 bg-[#f5f5f5] p-3 text-sm"
              >
                <div>
                  <div className="font-bold text-[#0a2e1c]">{formatPKR(w.amount)}</div>
                  <div className="text-xs capitalize text-black/50">
                    {w.method} · {formatDate(w.createdAt)}
                  </div>
                </div>
                <StatusBadge status={w.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
