"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  jobs: "Jobs",
};

export default function HeaderPageTitle() {
  const pathname = usePathname();
  const segment = pathname?.split("/").filter(Boolean)[0] ?? "";
  const pageTitle = PAGE_TITLES[segment] ?? "Dashboard";

  return <div>{pageTitle}</div>;
}
