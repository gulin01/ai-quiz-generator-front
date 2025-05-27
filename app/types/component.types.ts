export interface Quiz {
  cefr: string; // e.g., "A2", "B1"
  mode: string; // e.g., "TEXT_TO_TEXT", "TEXT_TO_IMAGE"
  question: string; // main question or prompt
  options: string[]; // array of answer choices (text or image URLs)
  answer: string; // correct answer
  explanation?: string; // optional explanation for feedback
}
