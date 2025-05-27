// app/sections/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Section {
  id: number;
  title: string;
  cefr: string;
  order: number;
}

export default function SectionListPage() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/sections")
      .then((res) => res.json())
      .then(setSections);
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-emerald-100">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        ? All Sections
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections?.map((s) => (
          <Link
            key={s.id}
            href={`/sections/${s.id}`}
            className="block p-6 bg-white rounded-xl shadow hover:shadow-md border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-indigo-600">{s.title}</h2>
            <p className="text-sm text-gray-600">CEFR: {s.cefr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
