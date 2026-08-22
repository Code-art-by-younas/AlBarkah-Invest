"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface Deposit {
  id: string;
  userId: string;
  amount: string;
  screenshot: string;
  paymentMethod: string | null;
  status: string;
  adminNote: string | null;
  approvedAt: string | null;
  createdAt: string;
  username: string | null;
  email: string | null;
  planName: string | null;
}

export function DepositRow({ deposit }: { deposit: Deposit }) {
  const [status, setStatus] = useState(deposit.status);
  const [loading, setLoading] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const handleAction = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus} this deposit?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/deposit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId: deposit.id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Deposit ${newStatus}ed successfully!`);
        setStatus(newStatus);
      } else {
        toast.error("Failed to update deposit");
      }
    } catch (err) {
      toast.error("Error updating deposit");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }[status] || "bg-gray-100 text-gray-800";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900">{deposit.username || "Unknown"}</p>
        <p className="text-xs text-gray-400">{deposit.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium text-[#0a2e1c]">{deposit.planName || "—"}</span>
      </td>
      <td className="px-4 py-3 font-bold text-[#0a2e1c]">
        {Number(deposit.amount).toFixed(0)} PKR
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
          {deposit.paymentMethod || "—"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">
        {formatDistanceToNow(new Date(deposit.createdAt), { addSuffix: true })}
      </td>
      <td className="px-4 py-3 text-right">
        {status === "pending" && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleAction("approved")}
              disabled={loading}
              className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("rejected")}
              disabled={loading}
              className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
        {deposit.screenshot && (
          <div className="mt-2">
            <button
              onClick={() => setShowScreenshot(!showScreenshot)}
              className="text-xs text-[#ffd700] hover:underline"
            >
              {showScreenshot ? "Hide Proof" : "View Proof"}
            </button>
            {showScreenshot && (
              <div className="mt-2 rounded-lg border p-2">
                <img
                  src={deposit.screenshot}
                  alt="Screenshot"
                  className="max-h-48 w-auto rounded"
                />
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
