// app/curriculum/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Quiz {
  id: number;
  question: string;
  answer: string;
}

export default function UnitQuizPage() {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetch(`/api/unit/${id}/quizzes`)
      .then((res) => res.json())
      .then(setQuizzes);
  }, [id]);

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Quizzes for Unit {id}
      </h1>
      <ul className="space-y-4">
        {quizzes.map((q) => (
          <li
            key={q.id}
            className="p-4 bg-white rounded shadow border border-gray-100"
          >
            <p className="font-medium">Q: {q.question}</p>
            <p className="text-sm text-gray-600">Answer: {q.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
