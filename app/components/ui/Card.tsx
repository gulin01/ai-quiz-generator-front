// src/components/ui/Card.tsx
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded shadow p-4 ${className}`}>{children}</div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}
export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}
export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}
export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
