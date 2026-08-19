import { db } from "@/db";
import { withdrawals, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatPKR, formatDate } from "@/lib/format";
import { WithdrawalRow } from "./WithdrawalRow";

export const dynamic = "force-dynamic";

type AccountDetails = { accountName?: string; accountNumber?: string; bankName?: string | null };

export default async function AdminWithdrawals() {
  const rows = await db
    .select({
      id: withdrawals.id,
      amount: withdrawals.amount,
      method: withdrawals.method,
      accountDetails: withdrawals.accountDetails,
      status: withdrawals.status,
      adminNote: withdrawals.adminNote,
      createdAt: withdrawals.createdAt,
      username: users.username,
      email: users.email,
    })
    .from(withdrawals)
    .leftJoin(users, eq(withdrawals.userId, users.id))
    .orderBy(desc(withdrawals.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Withdrawals</h1>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm text-black/50">
          No withdrawals yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const acc = (r.accountDetails ?? {}) as AccountDetails;
            return (
              <div key={r.id} className="rounded-2xl border border-black/5 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-[#0a2e1c]">
                      {r.username} <span className="text-black/40">({r.email})</span>
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-[#0a2e1c]">
                      {formatPKR(r.amount)}
                    </div>
                    <div className="mt-1 text-sm capitalize text-black/60">
                      {r.method} · {formatDate(r.createdAt)}
                    </div>
                    <div className="mt-2 rounded-lg bg-[#f5f5f5] p-3 text-sm">
                      <div>
                        <b>Name:</b> {acc.accountName}
                      </div>
                      <div>
                        <b>Number:</b> {acc.accountNumber}
                      </div>
                      {acc.bankName && (
                        <div>
                          <b>Bank:</b> {acc.bankName}
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                {r.status === "pending" ? (
                  <WithdrawalRow withdrawalId={r.id} />
                ) : (
                  r.adminNote && (
                    <p className="mt-3 rounded-lg bg-[#f5f5f5] p-2 text-xs text-black/60">
                      Note: {r.adminNote}
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
