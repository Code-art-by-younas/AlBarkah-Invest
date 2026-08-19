import { UserLayout } from "@/components/withUserShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}
