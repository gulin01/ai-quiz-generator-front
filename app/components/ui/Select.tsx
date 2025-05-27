// src/components/ui/Select.tsx
import React, { ReactNode } from "react";

interface SelectProps {
  value: string;
  onValueChange: (val: string) => void;
  children: ReactNode;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  children,
  className = "",
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`border rounded px-3 py-2 focus:ring focus:ring-blue-200 ${className}`}
    >
      {children}
    </select>
  );
}
