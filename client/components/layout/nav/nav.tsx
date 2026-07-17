"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavLogo from "@/public/assets/nav-logo.png";
import NavButton from "./nav-button";
import Button from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useSettings } from "@/lib/settings-context";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/jobs", label: "Jobs" },
];

type NavProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export default function Nav({ mobileOpen, onClose }: NavProps) {
  const { settings, updateSettings, setSettings } = useSettings();
  const expanded = settings.navExpanded ?? false;
  const router = useRouter();

  const toggleExpanded = () => {
    updateSettings({ navExpanded: !expanded });
  };

  const handleLogout = () => {
    apiFetch("/auth/logout", { method: "POST" })
      .catch(() => {})
      .finally(() => {
        setSettings({});
        onClose();
        router.push("/login");
      });
  };

  return (
    <>
      <aside className="hidden md:block bg-background border-r-2 border-subtle-background relative">
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
                loading="eager"
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

      <div
        aria-hidden={!mobileOpen}
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`md:hidden fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-background border-r-2 border-subtle-background pt-3 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "-translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="grid grid-cols-[66px_1fr] items-center px-1">
          <Link
            href="/dashboard"
            className="flex justify-center"
            onClick={onClose}
          >
            <Image
              src={NavLogo}
              alt="Logo"
              className="h-10 w-10"
              width={40}
              height={40}
              loading="eager"
            />
          </Link>
          <h1 className="font-medium leading-tight whitespace-nowrap">
            Inventory
            <br />
            <span className="text-subtle">Management</span>
          </h1>
        </div>
        <nav className="flex flex-col gap-1 mt-8 px-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
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
        <div className="mt-auto px-3 pb-4">
          <Button
            colorScheme="white"
            overrideStyle="py-2 px-3 text-sm flex items-center justify-center gap-2"
            rounded="xl"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
