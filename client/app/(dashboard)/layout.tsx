import Nav from "@/components/layout/nav/nav";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/jobs", label: "Jobs" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      <Nav />
      <div className="flex flex-1 flex-col">
        <header className="border-b border-black/10 px-6 py-4 dark:border-white/10">
          <span className="text-sm font-medium">A1 ERP</span>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
