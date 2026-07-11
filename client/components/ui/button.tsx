"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="px-3 py-2 bg-primary text-white rounded w-full font-bold"
    >
      {children}
    </button>
  );
}
