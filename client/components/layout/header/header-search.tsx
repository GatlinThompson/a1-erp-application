import { apiFetch } from "@/lib/api";
import HeaderSearchResults from "./header-search-result";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function HeaderSearch() {
  const [results, setResults] = useState<any[] | null>([]); // Replace `any` with the appropriate type for your search results
  const [isActive, setIsActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setResults(null);
    setIsActive(false);
    setSearchValue("");
  }, [pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchValue(query);

    apiFetch(`/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResults(data);
      });
  };

  return (
    <div
      className="flex items-center justify-center w-full h-full relative"
      onMouseLeave={() => setIsActive(false)}
      onMouseEnter={() => setIsActive(true)}
    >
      <form className="w-80 z-100 relative" onSubmit={(e) => e.preventDefault()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          onChange={handleSearch}
          onFocus={() => setIsActive(true)}
          value={searchValue}
          type="text"
          name="search"
          placeholder="Search for products, orders, etc..."
          className="w-full pl-8 pr-2 py-1 rounded-lg bg-input-background focus:outline-2 focus:outline-offset-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary border border-subtle-background"
        />
      </form>
      <HeaderSearchResults results={isActive ? results : null} />
    </div>
  );
}
