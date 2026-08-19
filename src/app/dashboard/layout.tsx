import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserShell } from "@/components/UserShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");
  return <UserShell username={session.username}>{children}</UserShell>;
}
