"use client";

import Link from "next/link";

type HeaderProfileProps = {
  firstName?: string | null;
  lastName?: string | null;
};

export default function HeaderProfile({
  firstName,
  lastName,
}: HeaderProfileProps) {
  const initials =
    (firstName?.charAt(0).toUpperCase() ?? "?") +
    (lastName?.charAt(0).toUpperCase() ?? "");

  return (
    <Link
      href="/profile"
      className="rounded-full min-w-9 min-h-9 max-h-9 max-w-9 bg-primary flex justify-center items-center text-xs font-semibold text-white"
    >
      {initials}
    </Link>
  );
}
