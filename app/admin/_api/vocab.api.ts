// app/vocab/vocab.api.ts
import axios from "axios";

// Use environment variable (make sure NEXT_PUBLIC_API_URL is defined in .env.local)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ? Vocabulary types
export interface VocabularyItem {
  id: number;
  word: string;
  definition: string;
  imageUrl?: string;
  unitId: number;
}

export interface CreateOrUpdateVocabDTO {
  word: string;
  definition: string;
  imageUrl?: string;
  unitId: number;
}

// ? API Calls

// Fetch all vocab for a unit
export async function getVocabularyByUnit(
  unitId: string | number
): Promise<VocabularyItem[]> {
  const res = await axios.get(`${BASE_URL}/vocab?unitId=${unitId}`);
  return res.data;
}

// Create a new vocab item
export async function createVocab(
  data: CreateOrUpdateVocabDTO
): Promise<VocabularyItem> {
  const res = await axios.post(`${BASE_URL}/vocab`, data);
  return res.data;
}

// Update an existing vocab item
export async function updateVocab(
  id: number,
  data: CreateOrUpdateVocabDTO
): Promise<VocabularyItem> {
  const res = await axios.put(`${BASE_URL}/vocab/${id}`, data);
  return res.data;
}

// Delete a vocab item
export async function deleteVocab(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/vocab/${id}`);
}
