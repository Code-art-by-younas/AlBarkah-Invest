import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { getPlans } from "@/lib/data";
import { PublicNavbar } from "@/components/PublicNavbar";

export default async function HomePage() {
  const session = await getSession();
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar session={session} />

      {/* ===== HERO ===== */}
      <section className="bg-[#0a2e1c] px-4 py-12 text-center text-white md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="relative h-16 w-16">
              <Image
                src="/logo.png"
                alt="AlBarkah Invest"
                fill
                className="object-contain"
                priority
                sizes="64px"
              />
            </div>
          </div>

          <h1 className="mb-4 text-2xl font-bold md:text-4xl lg:text-5xl">
            Invest in <span className="text-[#ffd700]">Trust</span>,
            <br />
            Grow in <span className="text-[#ffd700]">Blessing</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm text-gray-300 md:text-base">
            Invest via OPay, earn daily profits for 90 days, and build passive
            income with a 4-level referral program. Withdraw anytime via
            Easypaisa, JazzCash, SadaPay, OPay or Bank.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {session ? (
              <Link href="/dashboard" className="btn-gold">
                Go to Dashboard 🚀
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-gold">
                  Get Started Free
                </Link>
                <Link href="/login" className="btn-green">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Investment Plans", value: "12" },
              { label: "Days Profit", value: "90" },
              { label: "Referral Levels", value: "4" },
              { label: "Withdrawal Methods", value: "5" },
            ].map((stat, i) => (
              <div key={i} className="card text-center">
                <p className="text-2xl font-bold text-[#0a2e1c]">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-[#0a2e1c]">
            How It <span className="text-[#ffd700]">Works</span>
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Simple 3-step process to start earning
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { step: "1", title: "Register", desc: "Create your free account in seconds" },
              { step: "2", title: "Invest", desc: "Choose a plan and deposit via OPay" },
              { step: "3", title: "Withdraw", desc: "Cash out to Easypaisa, JazzCash & more" },
            ].map((item, i) => (
              <div key={i} className="card text-center animate-fade-in-up">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd700] text-lg font-bold text-[#0a2e1c]">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[#0a2e1c]">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section id="plans" className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-[#0a2e1c]">
            Investment <span className="text-[#ffd700]">Plans</span>
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            All plans run for 90 days of daily profit
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.id} className="card text-center">
                <p className="text-sm font-semibold text-[#ffd700]">{plan.name}</p>
                <p className="mt-1 text-xl font-bold text-[#0a2e1c]">
                  {Number(plan.amount).toFixed(0)} PKR
                </p>
                <p className="text-sm text-gray-500">
                  Daily: {Number(plan.dailyProfit).toFixed(0)} PKR
                </p>
                <p className="text-sm text-gray-400">
                  Total: {Number(plan.totalProfit).toFixed(0)} PKR
                </p>
                {session ? (
                  <Link
                    href="/deposit"
                    className="mt-3 inline-block w-full rounded-lg bg-[#0a2e1c] py-2 text-sm font-semibold text-white transition hover:bg-[#12503a]"
                  >
                    Invest Now
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="mt-3 inline-block w-full rounded-lg bg-[#0a2e1c] py-2 text-sm font-semibold text-white transition hover:bg-[#12503a]"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
    <footer className="border-t border-gray-200 bg-white px-4 py-6">
  <div className="mx-auto max-w-6xl">
    <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
      <p className="text-xs text-gray-500">
        © 2026 AlBarkah Invest. All rights reserved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <a
          href="https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#25D366] hover:underline"
        >
          📱 WhatsApp Channel
        </a>
        <a
          href="tel:03276376052"
          className="flex items-center gap-1 text-[#0a2e1c] hover:underline"
        >
          📞 Support: 0327-6376052
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}