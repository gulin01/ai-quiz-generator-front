import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Story {
  id: number;
  title: string;
  content: string;
  audioUrl?: string;
  unitId: number;
  keywords: string[];
}

/**
 * Fetch all stories
 */
export async function getAllStories(): Promise<Story[]> {
  const res = await axios.get(`${BASE_URL}/stories`);
  return res.data;
}

/**
 * Create a new story
 */
export async function createStory(data: Omit<Story, "id">): Promise<Story> {
  const res = await axios.post(`${BASE_URL}/stories`, data);
  return res.data;
}

/**
 * Update a story
 */
export async function updateStory(
  id: number,
  data: Partial<Story>
): Promise<Story> {
  const res = await axios.put(`${BASE_URL}/stories/${id}`, data);
  return res.data;
}

/**
 * Delete a story
 */
export async function deleteStory(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/stories/${id}`);
}

/**
 * Generate a new story via AI for a given unit
 */
export async function generateStory(
  unitId: number,
  options: { theme?: string; length?: "short" | "medium" | "long" }
): Promise<Story> {
  const res = await axios.post(
    `${BASE_URL}/stories/unit/${unitId}/generate-story`,
    options
  );
  return res.data;
}
