import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function SupportPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a2e1c]">Support Center</h1>
          <p className="text-sm text-gray-500">Need help? We're here for you 24/7.</p>
        </div>
        <Link
          href={session ? "/dashboard" : "/"}
          className="text-sm font-medium text-[#ffd700] hover:underline"
        >
          ← Back {session ? "to Dashboard" : "to Home"}
        </Link>
      </div>

      {/* ===== CONTACT CARDS ===== */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Phone Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0a2e1c]/10 text-2xl">
              📞
            </div>
            <div>
              <h3 className="font-semibold text-[#0a2e1c]">Phone Support</h3>
              <p className="text-sm text-gray-500">Call us for immediate assistance</p>
              <a
                href="tel:03276376052"
                className="mt-2 inline-block text-lg font-bold text-[#0a2e1c] transition hover:text-[#ffd700]"
              >
                0327-6376052
              </a>
              <p className="mt-1 text-xs text-gray-400">Available: 24/7</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-2xl">
              📱
            </div>
            <div>
              <h3 className="font-semibold text-[#0a2e1c]">WhatsApp Channel</h3>
              <p className="text-sm text-gray-500">Join for updates &amp; announcements</p>
              <a
                href="https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
              >
                Join Channel →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUICK HELP ===== */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[#0a2e1c]">Quick Help</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border-l-4 border-[#ffd700] bg-gray-50 p-3">
            <p className="font-medium text-[#0a2e1c]">How to invest?</p>
            <p className="text-sm text-gray-500">Plans → Select → Deposit via OPay</p>
          </div>
          <div className="rounded-lg border-l-4 border-[#ffd700] bg-gray-50 p-3">
            <p className="font-medium text-[#0a2e1c]">How to withdraw?</p>
            <p className="text-sm text-gray-500">Withdraw → Amount → Choose method</p>
          </div>
          <div className="rounded-lg border-l-4 border-[#ffd700] bg-gray-50 p-3">
            <p className="font-medium text-[#0a2e1c]">Daily profit?</p>
            <p className="text-sm text-gray-500">Earn daily for 90 days on your investment</p>
          </div>
          <div className="rounded-lg border-l-4 border-[#ffd700] bg-gray-50 p-3">
            <p className="font-medium text-[#0a2e1c]">Referral bonus?</p>
            <p className="text-sm text-gray-500">4-level commission (11%, 4%, 3%, 2%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}