"use client";

import { useState } from "react";

interface Plan {
  id: string;
  planName: string;
  amount: string;
  dailyProfit: string;
  totalEarned: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

interface ActivePlansProps {
  plans: Plan[];
}

export function ActivePlans({ plans }: ActivePlansProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (plans.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400">No active plans</p>
        <a href="/plans" className="mt-2 inline-block text-gold hover:underline">
          Invest Now →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => {
        const remainingDays = Math.ceil(
          (new Date(plan.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const progress =
          ((Number(plan.totalEarned) / (Number(plan.dailyProfit) * 90)) * 100);

        return (
          <div
            key={plan.id}
            className="rounded-xl bg-white/5 p-4 transition-all hover:bg-white/10"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-white">{plan.planName}</p>
                <p className="text-sm text-gray-400">
                  {Number(plan.amount).toFixed(0)} PKR • Daily: {Number(plan.dailyProfit).toFixed(0)} PKR
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-sm text-gray-400">Earned</p>
                  <p className="font-semibold text-gold">
                    {Number(plan.totalEarned).toFixed(0)} PKR
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Remaining</p>
                  <p className="font-semibold text-white">
                    {remainingDays > 0 ? `${remainingDays}d` : "✅ Done"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    plan.status === "active"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {plan.status}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {Math.min(progress, 100).toFixed(0)}% of total rewards
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}