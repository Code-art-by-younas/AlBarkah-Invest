import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserShell } from "@/components/UserShell";

export default async function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return <UserShell username={session.username}>{children}</UserShell>;
}