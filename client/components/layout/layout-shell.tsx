"use client";

import { useState } from "react";
import Header from "./header/header";
import Nav from "./nav/nav";
import type { SessionUser } from "@/lib/auth";

type LayoutShellProps = {
  user: SessionUser | null;
  children: React.ReactNode;
};

export default function LayoutShell({ user, children }: LayoutShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex flex-1">
      <Nav mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Header user={user} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-6 py-6 pt-8">{children}</main>
      </div>
    </div>
  );
}
