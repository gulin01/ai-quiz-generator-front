// src/components/QuizManager/ManageQuiz.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { deleteQuiz, getAllQuizzes } from "../_api/quiz.api";

interface Quiz {
  id: number;
  question: string;
}

export function ManageQuiz() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await getAllQuizzes();
        setQuizzes(res);
      } catch (err) {
        console.error("Error loading quizzes", err);
      }
    }
    fetchQuizzes();
  }, []);

  const handleEdit = (id: number) => {
    // navigate or open modal
    console.log("Edit quiz", id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await deleteQuiz(id);
      setQuizzes((qs) => qs.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((q) => (
        <Card key={q.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Quiz #{q.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 truncate">{q.question}</p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(q.id)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(q.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
