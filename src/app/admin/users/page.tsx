import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatPKR, formatDate } from "@/lib/format";
import { UserActions } from "./UserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.role, "user"))
    .orderBy(desc(users.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#0a2e1c]">Users</h1>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#f5f5f5] text-xs uppercase text-black/50">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Invested</th>
              <th className="px-4 py-3">Earned</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#0a2e1c]">{u.username}</div>
                  <div className="text-xs text-black/50">{u.email}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{u.referralCode}</td>
                <td className="px-4 py-3">{formatPKR(u.balance)}</td>
                <td className="px-4 py-3">{formatPKR(u.totalInvested)}</td>
                <td className="px-4 py-3">{formatPKR(u.totalEarned)}</td>
                <td className="px-4 py-3 text-xs">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                      u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <UserActions userId={u.id} status={u.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-black/50">No users yet.</p>
        )}
      </div>
    </div>
  );
}
