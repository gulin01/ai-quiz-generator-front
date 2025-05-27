"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Quiz } from "../types/component.types";

const API_URL = "http://localhost:3000/generate/list";

export default function QuizPlayer() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [textInput, setTextInput] = useState(""); // for free-text input
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quizzes[currentIndex];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    const res = await axios.get(API_URL);
    setQuizzes(res.data);
    setSelected(null);
    setTextInput("");
    setSubmitted(false);
    setCurrentIndex(0);
    setScore(0);
  }

  function handleSubmit() {
    if (!selected && !textInput) return;

    setSubmitted(true);

    const userAnswer = selected || textInput.trim().toLowerCase();
    const correctAnswer = currentQuiz.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setScore((s) => s + 1);
    }

    // Auto-advance unless it's the last question
    if (currentIndex < quizzes.length - 1) {
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setTextInput("");
        setSubmitted(false);
      }, 1200);
    }
  }

  function handleNext() {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setTextInput("");
      setSubmitted(false);
    }
  }
  function isImageUrl(url: string) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  }

  const resolveImageUrl = (rawPath: string) => {
    // Remove the `/app/public` part to form a URL path
    return "http://localhost:3000" + rawPath.replace("/app", "");
  };

  function renderChoices() {
    if (!currentQuiz?.options) return null;

    // Render image-based options based on quiz.mode
    if (
      currentQuiz.mode === "TEXT_TO_IMAGE" ||
      currentQuiz.mode === "DEFINITION_TO_IMAGE"
    ) {
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {currentQuiz.options.map((url, idx) => (
            <img
              key={idx}
              src={resolveImageUrl(url)}
              alt={`option-${idx}`}
              className={`w-40 h-40 object-cover rounded-xl cursor-pointer transition-all ${
                selected === url
                  ? "ring-4 ring-emerald-500"
                  : "hover:ring-2 hover:ring-indigo-300"
              }`}
              onClick={() => setSelected(url)}
            />
          ))}
        </div>
      );
    }

    // Otherwise assume text-based options
    return (
      <div className="mt-4 space-y-3">
        {currentQuiz.options.map((option, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(option)}
            className={`p-3 rounded-lg text-lg font-medium cursor-pointer transition-all ${
              selected === option
                ? "bg-emerald-100 border-2 border-emerald-500 text-black"
                : "bg-white border border-gray-300 text-slate-800 hover:bg-gray-100"
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    );
  }
  if (!currentQuiz)
    return (
      <div className="text-center py-20 text-xl text-slate-700">
        ? Loading pretest...
      </div>
    );

  if (currentIndex >= quizzes.length) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 font-sans">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">
          ? Test Complete!
        </h2>
        <p className="text-xl mb-2 text-slate-900">
          ? You got <strong>{score}</strong> out of{" "}
          <strong>{quizzes.length}</strong> correct!
        </p>
        <p className="text-xl text-emerald-700 font-semibold">
          ? Estimated Level:{" "}
          <strong>
            {score < 5 ? "A1" : score < 9 ? "A2" : score < 12 ? "B1" : "B2+"}
          </strong>
        </p>
        <button
          onClick={fetchQuizzes}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700"
        >
          ? Restart Pretest
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md font-sans">
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">
        ? AI Placement Pretest
      </h2>
      <p className="text-slate-900 mb-1 text-base">
        <strong>Level:</strong> {currentQuiz.cefr} | <strong>Mode:</strong>{" "}
        {currentQuiz.mode}
      </p>
      <div className="mt-4">
        {currentQuiz.mode === "IMAGE_TO_TEXT" ? (
          <img
            src={resolveImageUrl(currentQuiz.question)}
            alt="Question"
            className="w-full max-w-lg mx-auto rounded shadow-md"
          />
        ) : (
          <p className="text-2xl font-bold text-black leading-snug">
            {currentQuiz.question}
          </p>
        )}
      </div>

      {renderChoices()}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected && !textInput}
          className="mt-6 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          Submit
        </button>
      ) : (
        <div className="mt-6">
          {(selected || textInput.trim()) &&
          (selected?.toLowerCase() === currentQuiz.answer.toLowerCase() ||
            textInput.trim().toLowerCase() ===
              currentQuiz.answer.trim().toLowerCase()) ? (
            <p className="text-green-600 font-bold text-lg">? Correct!</p>
          ) : (
            <p className="text-red-600 font-bold text-lg">
              ? Wrong. Correct answer: {currentQuiz.answer}
            </p>
          )}
          <p className="text-base text-black mt-1">{currentQuiz.explanation}</p>

          {currentIndex === quizzes.length - 1 && (
            <button
              onClick={handleNext}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Finish Test
            </button>
          )}
        </div>
      )}
    </div>
  );
}
