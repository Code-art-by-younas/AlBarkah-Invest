interface AccountSummaryProps {
  totalInvested: number;
  totalWithdrawn: number;
  totalPayout: number;
  totalReferral: number;
  pendingDeposit: number;
  pendingWithdrawal: number;
  teamCount: number;
  teamInvest: number;
}

export function AccountSummary({
  totalInvested,
  totalWithdrawn,
  totalPayout,
  totalReferral,
  pendingDeposit,
  pendingWithdrawal,
  teamCount,
  teamInvest,
}: AccountSummaryProps) {
  const items = [
    { label: "TOTAL INVESTED", value: totalInvested, icon: "💰" },
    { label: "WITHDRAWAL", value: totalWithdrawn, icon: "💸" },
    { label: "PAYOUT", value: totalPayout, icon: "📤" },
    { label: "REFER BONUS", value: totalReferral, icon: "👥" },
    { label: "PENDING DEPOSIT", value: pendingDeposit, icon: "⏳" },
    { label: "PENDING WITHDRAWAL", value: pendingWithdrawal, icon: "⏳" },
    { label: "TEAM", value: `${teamCount} users`, icon: "👤" },
    { label: "TEAM INVEST", value: teamInvest, icon: "📊" },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#0a2e1c]">Account Summary</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-center transition hover:bg-gray-50"
          >
            <p className="text-sm text-gray-500">{item.icon} {item.label}</p>
            <p className="text-lg font-bold text-[#0a2e1c]">
              {typeof item.value === "number" ? `Rs. ${item.value.toFixed(0)}` : item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}