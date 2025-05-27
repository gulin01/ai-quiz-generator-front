// src/components/ui/Tabs.tsx
import React, { createContext, useContext, ReactNode } from "react";

type TabsContextType = { value: string; onChange: (val: string) => void };
const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: ReactNode;
  classname?: string;
}
export function Tabs({
  value,
  onValueChange,
  children,
  classname = "",
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={classname}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}
export function TabsList({ children, className = "" }: TabsListProps) {
  return <div className={`flex space-x-2 ${className}`}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}
export function TabsTrigger({
  value: val,
  children,
  className = "",
}: TabsTriggerProps) {
  const ctx = useContext(TabsContext)!;
  const isActive = ctx.value === val;
  return (
    <button
      className={`px-4 py-2 rounded-full transition ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
      } ${className}`}
      onClick={() => ctx.onChange(val)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}
export function TabsContent({
  value: val,
  children,
  className = "",
}: TabsContentProps) {
  const ctx = useContext(TabsContext)!;
  if (ctx.value !== val) return null;
  return <div className={className}>{children}</div>;
}
