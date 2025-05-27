// app/curriculum/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Quiz {
  id: number;
  question: string;
  cefr: string;
}

interface Unit {
  id: number;
  theme: string;
  grammarPoint: string;
  cefr: string;
  section: {
    title: string;
  };
  quizzes?: Quiz[];
}

export default function UnitPage() {
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      const res = await fetch("/api/unit?includeQuizzes=true");
      const data = await res.json();
      setUnitList(data);
      setLoading(false);
    };
    fetchUnit();
  }, []);

  if (loading) return <div className="p-8">Loading curriculum...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Unit Viewer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {unitList.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-blue-600">{c.theme}</h2>
            <p className="text-sm text-gray-600">Grammar: {c.grammarPoint}</p>
            <p className="text-sm text-gray-500 mb-2">
              CEFR: {c.cefr} ? Section: {c.section.title}
            </p>
            <button
              onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              className="text-sm text-indigo-500 hover:underline"
            >
              {selectedId === c.id ? "Hide Quizzes" : "View Quizzes"}
            </button>
            {selectedId === c.id && c.quizzes?.length ? (
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside">
                {c.quizzes.map((q) => (
                  <li key={q.id}>{q.question}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
