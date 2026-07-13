"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  colorScheme?: "blue" | "white";
  disabled?: boolean;
  overrideStyle?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
};

export default function Button({
  children,
  onClick,
  type = "button",
  colorScheme = "blue",
  disabled = false,
  overrideStyle = "",
  rounded = "sm",
}: ButtonProps) {
  const colorClass =
    colorScheme === "blue"
      ? "bg-primary text-white"
      : "bg-white text-primary border border-subtle-background";

  const roundedClass =
    rounded === "none"
      ? "rounded-none"
      : rounded === "sm"
        ? "rounded"
        : rounded === "md"
          ? "rounded-md"
          : rounded === "lg"
            ? "rounded-lg"
            : rounded === "xl"
              ? "rounded-xl"
              : "rounded-full";
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${roundedClass} w-full font-bold ${colorClass} ${overrideStyle}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
