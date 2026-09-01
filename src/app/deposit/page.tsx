import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPlans } from "@/lib/data";
import { DepositForm } from "./DepositForm";
import { UserShell } from "@/components/user/UserShell";

export const dynamic = "force-dynamic";

export default async function DepositPage() {
  try {
    const session = await getServerSession(authOptions);
    let plans = [];
    try {
      plans = await getPlans();
    } catch {
      plans = [];
    }

    // ✅ ONLY OPay for deposit
    const paymentMethods = [
      {
        id: "opay",
        label: "OPay",
        icon: "💳",
        accountName: "Muhammad Shahzad Pervaiz",
        accountNumber: "03320613270",
      },
    ];

    const plansData = plans.map((p: any) => ({
      id: p.id,
      name: p.name,
      amount: p.amount,
      dailyProfit: p.dailyProfit,
      totalProfit: p.totalProfit,
    }));

    const whatsappChannelLink = "https://whatsapp.com/channel/0029VbDGJWs8fewqixXOVn2y";

    const content = (
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Make a Deposit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Select plan, send payment via OPay, and upload receipt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DepositForm plans={plansData} paymentMethods={paymentMethods} />
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#132a4e] to-[#0f213d] border border-[#00D4FF]/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[#FFD700]">
                <span className="text-sm font-bold">📌 Important</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                <li>Minimum deposit: <span className="text-[#FFD700] font-bold">150 PKR</span></li>
                <li>Send exact amount to OPay number shown</li>
                <li>Keep the screenshot clear</li>
                <li>Approval usually takes 15-30 minutes</li>
              </ul>
              <div className="pt-4 border-t border-[#1e3a66]">
                <p className="text-xs text-slate-400">📢 Join our WhatsApp Channel</p>
                <a
                  href={whatsappChannelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00D4FF] hover:underline text-sm font-bold"
                >
                  Click here to join →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return session ? (
      <UserShell username={session.user?.username || "User"}>{content}</UserShell>
    ) : (
      content
    );
  } catch (error) {
    console.error("Deposit page error:", error);
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-slate-400 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}
