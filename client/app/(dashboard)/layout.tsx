import Header from "@/components/layout/header/header";
import Nav from "@/components/layout/nav/nav";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/jobs", label: "Jobs" },
];

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <div className="flex flex-1">
      <Nav />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
