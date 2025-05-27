"use client";
import Image from "next/image";
import QuizPlayer from "./components/QuizPlayer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50 p-8 sm:p-20 font-sans">
      <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 drop-shadow-sm">
            🎯 연단어 데포 어드민 및 사용자
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Find your English level in minutes with fun and interactive
            questions.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <a
              href="/admin"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
            >
              Admin Panel
            </a>
            <a
              href="/sections"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
            >
              Start Quiz
            </a>
          </div>
        </header>
        {/* 
        <section>
          <QuizPlayer />
        </section> */}
      </main>
      <footer className="mt-16 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} AI English test. All rights reserved.
      </footer>
    </div>
  );
}
