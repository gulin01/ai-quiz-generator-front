import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Unit {
  id: number;
  sectionId: number;
  grammarPoint: string;
  name: string;
  storyId?: number;
  order: number;
}

export interface Quiz {
  id: number;
  unitId: number;
  question: string;
  type: string;
  mode: string;
}

/**
 * Fetch all units
 */
export async function getAllUnits(): Promise<Unit[]> {
  const res = await axios.get(`${BASE_URL}/unit`);
  return res.data;
}

/**
 * Fetch a single unit by ID
 */
export async function getUnitById(id: number): Promise<Unit> {
  const res = await axios.get(`${BASE_URL}/unit/${id}`);
  return res.data;
}

/**
 * Create a new unit
 */
export async function createUnit(data: Omit<Unit, "id">): Promise<Unit> {
  const res = await axios.post(`${BASE_URL}/unit`, data);
  return res.data;
}

/**
 * Update a unit
 */
export async function updateUnit(
  id: number,
  data: Partial<Unit>
): Promise<Unit> {
  const res = await axios.put(`${BASE_URL}/unit/${id}`, data);
  return res.data;
}

/**
 * Delete a unit
 */
export async function deleteUnit(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/unit/${id}`);
}

/**
 * Fetch quizzes for a given unit
 */
export async function getUnitQuizzes(unitId: number): Promise<Quiz[]> {
  const res = await axios.get(`${BASE_URL}/unit/${unitId}/quizzes`);
  return res.data;
}
