import { db } from "@/db";
import { deposits, users, plans } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatPKR, formatDate } from "@/lib/format";
import { DepositRow } from "./DepositRow";

export const dynamic = "force-dynamic";

export default async function AdminDeposits() {
  const rows = await db
    .select({
      id: deposits.id,
      amount: deposits.amount,
      screenshot: deposits.screenshot,
      senderName: deposits.senderName,
      transactionId: deposits.transactionId,
      status: deposits.status,
      adminNote: deposits.adminNote,
      createdAt: deposits.createdAt,
      username: users.username,
      email: users.email,
      planName: plans.name,
    })
    .from(deposits)
    .leftJoin(users, eq(deposits.userId, users.id))
    .leftJoin(plans, eq(deposits.planId, plans.id))
    .orderBy(desc(deposits.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Deposits</h1>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm text-black/50">
          No deposits yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-[#0a2e1c]">
                    {r.username} <span className="text-black/40">({r.email})</span>
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    {r.planName} · {formatPKR(r.amount)} · {formatDate(r.createdAt)}
                  </div>
                  {r.senderName && (
                    <div className="text-xs text-black/50">Sender: {r.senderName}</div>
                  )}
                  {r.transactionId && (
                    <div className="text-xs text-black/50">TXN: {r.transactionId}</div>
                  )}
                </div>
                <StatusBadge status={r.status} />
              </div>

              {r.screenshot && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.screenshot}
                  alt="proof"
                  className="mt-3 max-h-56 rounded-lg border border-black/10"
                />
              )}

              {r.status === "pending" ? (
                <DepositRow depositId={r.id} />
              ) : (
                r.adminNote && (
                  <p className="mt-3 rounded-lg bg-[#f5f5f5] p-2 text-xs text-black/60">
                    Note: {r.adminNote}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}
