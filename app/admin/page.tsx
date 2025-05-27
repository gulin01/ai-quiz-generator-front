"use client";

import { useState, useEffect } from "react";
import ManageSections from "./_components/ManageSections";
import ManageUnits from "./_components/ManageUnits";
import ManageVocab from "./_components/ManageVocab";
import ManageStories from "./_components/ManageStories";
import { getAllSections } from "./_api/section.api";
import { getAllUnits } from "./_api/units.api";
import { ManageQuiz } from "./_components/ManageQuiz";
import { GenerateQuiz } from "./_components/GenerateQuiz";

export interface Section {
  id: number;
  title: string;
  cefr: string;
  order: number;
}

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
  question: string;
  cefr: string;
  unitId: number;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  audioUrl?: string;
  unitId: number;
  keywords: string[];
}

const TABS = [
  { key: "Generate Quiz", label: "퀴즈 생성" },
  { key: "Manage Quiz", label: "퀴즈 관리" },
  { key: "Manage Sections", label: "섹션 관리" },
  { key: "Manage Units", label: "유닛 관리" },
  { key: "Manage Stories", label: "스토리 관리" },
  { key: "Manage Vocab", label: "단어 관리" },
];

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    getAllSections().then(setSections).catch(console.error);
    getAllUnits().then(setUnits).catch(console.error);

    fetch(`${API}/generate/list`)
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(console.error);

    fetch(`${API}/stories`)
      .then((res) => res.json())
      .then(setStories)
      .catch(console.error);
  }, []);

  const handleGenerateQuiz = async (cefr: string, unitId: string) => {
    const res = await fetch(`${API}/unit/${unitId}/ai-quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cefr }),
    });

    if (res.ok) {
      const updated = await fetch(`${API}/quizzes`).then((r) => r.json());
      setQuizzes(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          Admin Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all ${
                activeTab.key === tab.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab.key === "Generate Quiz" && <GenerateQuiz />}

        {activeTab.key === "Manage Quiz" && <ManageQuiz />}

        {activeTab.key === "Manage Sections" && (
          <ManageSections sections={sections} />
        )}

        {activeTab.key === "Manage Units" && <ManageUnits units={units} />}

        {activeTab.key === "Manage Stories" && (
          <ManageStories stories={stories} />
        )}

        {activeTab.key === "Manage Vocab" && <ManageVocab />}
      </div>
    </div>
  );
}
