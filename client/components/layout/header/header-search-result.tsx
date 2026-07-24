import React from "react";
import Link from "next/link";

type HeaderSearchResultsProps = {
  results: any[] | null; // Replace `any` with the appropriate type for your search results
};

export default function HeaderSearchResults({
  results,
}: HeaderSearchResultsProps) {
  return (
    <div
      className={`w-full pt-8.5 absolute top-0 left-0 bg-input-background z-50 rounded-lg shadow-md ${results && results.length > 0 ? "block" : "hidden"}`}
    >
      <div>
        <ul>
          {results?.map((result, index) => (
            <ProductResult key={index} result={result} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export const ProductResult = ({ result }: { result: any }) => {
  return (
    <li className="flex flex-col p-2 border-b border-gray-300 hover:bg-gray-200 transition-colors duration-200">
      <Link
        className="font-bold flex flex-col gap-0.5 hover:text-secondary transition-colors duration-200 text-primary text-sm"
        href={`/products/${result.sku}`}
      >
        <span>{result.sku}</span>
        {result.name && (
          <span className="flex-1 text-xs font-normal  text-gray-500 truncate -mt-1.5">
            {result.name}
          </span>
        )}
      </Link>
    </li>
  );
};
