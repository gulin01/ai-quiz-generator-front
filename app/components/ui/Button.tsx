// src/components/ui/Button.tsx
import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
}
const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};
const variantClasses = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};
export function Button({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
