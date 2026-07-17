"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useSettings } from "@/lib/settings-context";
import HeaderProfile from "./header-profile";
import type { SessionUser } from "@/lib/auth";

type HeaderProps = {
  user?: SessionUser | null;
};

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const { setSettings } = useSettings();

  const handleLogout = () => {
    apiFetch("/auth/logout", { method: "POST" })
      .catch(() => {})
      .finally(() => {
        setSettings({});
        router.push("/login");
      });
  };

  return (
    <header
      className="bg-background border-b-2 border-subtle-background px-6 pt-3
    pb-1.5 flex justify-between items-center"
    >
      <span className="text-sm font-medium flex-1">A1 ERP</span>
      <div className="flex flex-row gap-5">
        <HeaderProfile
          firstName={user?.firstName ?? null}
          lastName={user?.lastName ?? null}
          userId={user?.userId ?? null}
        />
        <Button
          colorScheme="white"
          overrideStyle="py-2 px-3 text-sm flex items-center gap-2"
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
    </header>
  );
}
