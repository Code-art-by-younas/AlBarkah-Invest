import { Transaction } from "@/db/schema";
import { formatDistanceToNow } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-500";
      case "withdrawal":
        return "text-red-500";
      case "reward":
        return "text-gold";
      case "referral":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "⬇️";
      case "withdrawal":
        return "⬆️";
      case "reward":
        return "⭐";
      case "referral":
        return "👥";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{getTypeIcon(tx.type)}</span>
            <div>
              <p className="text-sm font-medium text-white">
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
            <span
              className={`text-xs ${
                tx.status === "completed" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}