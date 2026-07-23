import LayoutShell from "@/components/layout/layout-shell";
import { getSessionUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return <LayoutShell user={user}>{children}</LayoutShell>;
}
