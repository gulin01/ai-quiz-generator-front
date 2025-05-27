// src/components/QuizManager/GenerateQuiz.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Select } from "@/app/components/ui/Select";
import { getAllSections, Section } from "../_api/section.api";
import { getAllUnits, Unit } from "../_api/units.api";
import { generateQuiz } from "../_api/quiz.api";

export function GenerateQuiz() {
  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [type, setType] = useState<string>("MCQ");
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Matching state
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const secs = await getAllSections();
        setSections(secs);
        if (secs.length) setSelectedSection(secs[0].id.toString());
        const us = await getAllUnits();
        setUnits(us);
      } catch {
        setError("Failed to load data");
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const filtered = units.filter(
      (u) => u.sectionId.toString() === selectedSection
    );
    setUnitId(filtered.length ? filtered[0].id.toString() : "");
  }, [selectedSection, units]);

  // Initialize matching lists on new quiz
  useEffect(() => {
    if (generatedQuiz?.mode === "MATCH_TEXT_TEXT") {
      const mapObj: Record<string, string> = JSON.parse(
        generatedQuiz.matchingMap
      );
      setLeftItems(Object.keys(mapObj));
      setRightItems(shuffle(Object.values(mapObj)));
      setMatchedPairs({});
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongPair(null);
    }
  }, [generatedQuiz]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedQuiz(null);
    try {
      const q = await generateQuiz(Number(unitId), type);
      setGeneratedQuiz(q);
    } catch {
      setError("Quiz generation failed.");
    } finally {
      setLoading(false);
    }
  };

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const handleSelect = (value: string, side: "left" | "right") => {
    let newLeft = selectedLeft;
    let newRight = selectedRight;
    if (side === "left") newLeft = value;
    else newRight = value;

    setSelectedLeft(newLeft);
    setSelectedRight(newRight);

    if (newLeft && newRight) {
      const mapObj: Record<string, string> = JSON.parse(
        generatedQuiz.matchingMap
      );
      if (mapObj[newLeft] === newRight) {
        // correct pair
        setMatchedPairs((prev) => ({ ...prev, [newLeft!]: newRight! }));
        setLeftItems((prev) => prev.filter((w) => w !== newLeft));
        setRightItems((prev) => prev.filter((d) => d !== newRight));
      } else {
        // wrong pair, highlight both briefly
        setWrongPair([newLeft, newRight]);
        setTimeout(() => setWrongPair(null), 1000);
      }
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const renderMatching = () => (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4">
        Match the words
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          {leftItems.map((word) => {
            const isSelected = selectedLeft === word;
            const isWrong = wrongPair?.[0] === word;
            return (
              <button
                key={word}
                className={`w-full p-3 rounded-lg border transition ${
                  isWrong
                    ? "border-red-500 bg-red-100 text-red-700"
                    : isSelected
                    ? "border-indigo-500 bg-indigo-100 text-indigo-700"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
                onClick={() => handleSelect(word, "left")}
              >
                {word}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightItems.map((def) => {
            const isSelected = selectedRight === def;
            const isWrong = wrongPair?.[1] === def;
            return (
              <button
                key={def}
                className={`w-full p-3 rounded-lg border transition ${
                  isWrong
                    ? "border-red-500 bg-red-100 text-red-700"
                    : isSelected
                    ? "border-indigo-500 bg-indigo-100 text-indigo-700"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
                onClick={() => handleSelect(def, "right")}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 space-y-1">
        {Object.entries(matchedPairs).map(([l, r]) => (
          <p key={l} className="text-green-600 font-medium">
            {l} ↔ {r}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="bg-white p-8 rounded-2xl shadow-lg">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-3xl font-extrabold text-indigo-600">
          Generate a New Quiz
        </CardTitle>
        <p className="mt-2 text-gray-500">
          Select a section, unit, and quiz type to generate AI-powered
          questions.
        </p>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-gray-700">Section</label>
            <Select
              value={selectedSection}
              onValueChange={setSelectedSection}
              className="w-full"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id.toString()}>
                  {sec.title} ({sec.cefr})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Unit</label>
            <Select value={unitId} onValueChange={setUnitId} className="w-full">
              {units
                .filter((u) => u.sectionId.toString() === selectedSection)
                .map((u) => (
                  <option key={u.id} value={u.id.toString()}>
                    {u.name}
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Quiz Type</label>
            <Select value={type} onValueChange={setType} className="w-full">
              <option value="MCQ">Multiple Choice</option>
              <option value="SENTENCE_ORDER">Sentence Order</option>
              <option value="MATCHING">Matching</option>
            </Select>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } px-10`}
          >
            {loading ? "Generating…" : "Generate Quiz"}
          </Button>
        </div>
        {generatedQuiz && (
          <div className="mt-8">
            <Card className="bg-gray-50 p-6 rounded-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">
                  {generatedQuiz.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {type === "MATCHING" && renderMatching()}
                {generatedQuiz.explanation && (
                  <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-indigo-400">
                    <strong className="text-[#2834d8]">Explanation: </strong>
                    <span className="text-[#e328ce]">
                      {generatedQuiz.explanation}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
