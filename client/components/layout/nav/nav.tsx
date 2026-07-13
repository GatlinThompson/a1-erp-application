"use client";

import Link from "next/link";
import Image from "next/image";
import NavLogo from "@/public/assets/nav-logo.png";
import NavButton from "./nav-button";
import { useSettings } from "@/lib/settings-context";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/jobs", label: "Jobs" },
];

export default function Nav() {
  const { settings, updateSettings } = useSettings();
  const expanded = settings.navExpanded ?? false;

  const toggleExpanded = () => {
    updateSettings({ navExpanded: !expanded });
  };

  return (
    <aside className="bg-background border-r-2 border-subtle-background relative">
      <NavButton expanded={expanded} onClick={toggleExpanded} />
      <div
        className={`overflow-hidden pt-3 transition-[width] duration-300 ease-in-out ${
          expanded ? "w-47" : "w-16.5"
        }`}
      >
        <div className="grid w-47 grid-cols-[66px_1fr] items-center">
          <Link href="/dashboard" className="flex justify-center">
            <Image
              src={NavLogo}
              alt="Logo"
              className="h-10 w-10"
              width={40}
              height={40}
            />
          </Link>
          <h1 className="font-medium leading-tight whitespace-nowrap">
            Inventory
            <br />
            <span className="text-subtle">Management</span>
          </h1>
        </div>
        <nav className="flex w-47 flex-col gap-1 mt-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="grid grid-cols-[66px_1fr] items-center rounded py-2 text-sm font-medium whitespace-nowrap"
            >
              <span className="flex justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-lg font-semibold uppercase text-primary">
                  {link.label.charAt(0)}
                </span>
              </span>
              <span className="text-sm font-normal">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
