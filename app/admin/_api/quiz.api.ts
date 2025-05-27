// src/components/QuizManager/quiz.api.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Quiz {
  id: number;
  unitId: number;
  question: string;
  type: string;
  mode: string;
  choices?: any[];
  answer?: string;
  explanation?: string;
}

/**
 * Fetch all quizzes
 */
export async function getAllQuizzes(): Promise<Quiz[]> {
  const res = await axios.get<Quiz[]>(`${BASE_URL}/quizzes`);
  return res.data;
}

/**
 * Fetch a single quiz by ID
 */
export async function getQuizById(id: number): Promise<Quiz> {
  const res = await axios.get<Quiz>(`${BASE_URL}/quizzes/${id}`);
  return res.data;
}

/**
 * Generate a new quiz for a given unit and type
 */
export async function generateQuiz(
  unitId: number,
  quizType: string
): Promise<Quiz> {
  const res = await axios.post<Quiz>(`${BASE_URL}/quiz/generate`, {
    unitId,
    quizType,
  });
  return res.data;
}

/**
 * Create a quiz manually
 */
export async function createQuiz(data: Partial<Quiz>): Promise<Quiz> {
  const res = await axios.post<Quiz>(`${BASE_URL}/quizzes`, data);
  return res.data;
}

/**
 * Update an existing quiz
 */
export async function updateQuiz(
  id: number,
  data: Partial<Quiz>
): Promise<Quiz> {
  const res = await axios.put<Quiz>(`${BASE_URL}/quizzes/${id}`, data);
  return res.data;
}

/**
 * Delete a quiz by ID
 */
export async function deleteQuiz(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/quizzes/${id}`);
}
