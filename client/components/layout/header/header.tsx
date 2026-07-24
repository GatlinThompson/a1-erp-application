import HeaderProfile from "./header-profile";
import type { SessionUser } from "@/lib/auth";
import LogoutButton from "./header-logout";
import HeaderPageTitle from "./header-page-title";
import HeaderSearch from "./header-search";

type HeaderProps = {
  user?: SessionUser | null;
  onOpenMobileNav: () => void;
};

export default function Header({ user, onOpenMobileNav }: HeaderProps) {
  return (
    <header
      className="bg-background border-b-2 border-subtle-background px-6 pt-3
    pb-1.5 flex  justify-end md:justify-between items-center"
    >
      <span className="text-lg font-medium flex-1">
        <HeaderPageTitle />
      </span>
      <div className="flex flex-row items-center gap-5">
        <HeaderSearch />
        <HeaderProfile
          firstName={user?.firstName ?? null}
          lastName={user?.lastName ?? null}
          userId={user?.userId ?? null}
        />
        <LogoutButton />
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
      </div>
    </header>
  );
}
