// app/sections/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Unit {
  id: number;
  theme: string;
  grammarPoint: string;
  cefr: string;
}

export default function CurriculumListPage() {
  const { id } = useParams();
  const [unit, setUnit] = useState<Unit[]>([]);
  console.log("CurriculumListPage", id);

  useEffect(() => {
    fetch(`http://localhost:3000/sections/${id}/unit`)
      .then((res) => res.json())
      .then(setUnit);
  }, [id]);

  return (
    <div className="min-h-screen p-10 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Units in Section {id}
      </h1>
      <div className="space-y-4">
        {unit.map((c) => (
          <Link
            key={c.id}
            href={`/unit/${c.id}`}
            className="block p-5 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100"
          >
            <h2 className="font-semibold text-blue-800">{c.theme}</h2>
            <p className="text-sm text-gray-600">
              Grammar: {c.grammarPoint} ? CEFR: {c.cefr}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
