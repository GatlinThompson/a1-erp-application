import React from "react";

type NavButtonProps = {
  onClick?: () => void;
  expanded?: boolean;
};

export default function NavButton({ onClick, expanded }: NavButtonProps) {
  return (
    <div className="absolute top-0 right-0 pt-2 -mr-1.5">
      <button
        onClick={onClick}
        className="rounded-r-xs rounded-l-sm bg-secondary text-primary-foreground h-11 w-3  text-white font-semibold"
      >
        <span className="ml-0.5 text-xs"> {expanded ? "<" : ">"}</span>
      </button>
    </div>
  );
}
