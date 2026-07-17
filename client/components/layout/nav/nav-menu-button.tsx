import React from "react";

type NavMenuButtonProps = {
  onOpenMobileNav: () => void;
};

export default function NavMenuButton({ onOpenMobileNav }: NavMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpenMobileNav}
      aria-label="Open navigation menu"
      className="md:hidden text-secondary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
