// app/sections/section.api.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Section {
  id: number;
  title: string;
  cefr: string;
  order: number;
}

/**
 * Fetch all sections
 */
export async function getAllSections(): Promise<Section[]> {
  const res = await axios.get(`${BASE_URL}/sections`);
  return res.data;
}

/**
 * Fetch a single section by ID
 */
export async function getSectionById(id: number): Promise<Section> {
  const res = await axios.get(`${BASE_URL}/sections/${id}`);
  return res.data;
}

/**
 * Create a new section
 */
export async function createSection(
  data: Omit<Section, "id">
): Promise<Section> {
  const res = await axios.post(`${BASE_URL}/sections`, data);
  return res.data;
}

/**
 * Update a section
 */
export async function updateSection(
  id: number,
  data: Partial<Section>
): Promise<Section> {
  const res = await axios.patch(`${BASE_URL}/sections/${id}`, data);
  return res.data;
}

/**
 * Delete a section
 */
export async function deleteSection(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/sections/${id}`);
}
