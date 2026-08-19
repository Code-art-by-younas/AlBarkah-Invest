import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-[#0a2e1c]">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-black/60">Login to your account</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-black/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#0a2e1c] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
