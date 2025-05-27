"use client";

import { useEffect, useState } from "react";
import {
  createVocab,
  deleteVocab,
  getVocabularyByUnit,
  updateVocab,
  VocabularyItem,
} from "../_api/vocab.api";

interface Section {
  id: number;
  title: string;
  cefr: string;
}

interface Unit {
  id: number;
  name: string;
  grammarPoint: string;
  sectionId: number;
}

export default function ManageVocab() {
  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [vocabByUnit, setVocabByUnit] = useState<
    Record<number, VocabularyItem[]>
  >({});
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");

  const [formData, setFormData] = useState({
    word: "",
    definition: "",
    imageUrl: "",
  });

  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    // Fetch sections and units
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sections`).then((res) =>
        res.json()
      ),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`).then((res) =>
        res.json()
      ),
    ]).then(async ([sectionData, unitData]) => {
      setSections(sectionData);
      setUnits(unitData);

      // Fetch vocab for all units
      const vocabEntries = await Promise.all(
        unitData.map((u: Unit) =>
          getVocabularyByUnit(u.id).then((vocab) => [u.id, vocab])
        )
      );

      setVocabByUnit(Object.fromEntries(vocabEntries));
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ word: "", definition: "", imageUrl: "" });
    setEditingItem(null);
    setSelectedUnitId("");
  };

  const handleSubmit = async () => {
    if (!formData.word || !formData.definition || !selectedUnitId) return;

    const data = {
      ...formData,
      unitId: parseInt(selectedUnitId),
    };

    try {
      if (editingItem) {
        await updateVocab(editingItem.id, data);
      } else {
        await createVocab(data);
      }

      const updated = await getVocabularyByUnit(Number(selectedUnitId));
      setVocabByUnit((prev) => ({ ...prev, [selectedUnitId]: updated }));
      resetForm();
    } catch (error) {
      console.error("Failed to save vocab:", error);
    }
  };

  const handleEdit = (item: VocabularyItem, unitId: number) => {
    setEditingItem(item);
    setSelectedUnitId(unitId.toString());
    setFormData({
      word: item.word,
      definition: item.definition,
      imageUrl: item.imageUrl || "",
    });
  };

  const handleDelete = async (id: number, unitId: number) => {
    if (!confirm("Delete this vocabulary item?")) return;
    try {
      await deleteVocab(id);
      const updated = await getVocabularyByUnit(unitId);
      setVocabByUnit((prev) => ({ ...prev, [unitId]: updated }));
    } catch (error) {
      console.error("Failed to delete vocab:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-indigo-900">단어 관리</h2>

      {/* Form */}
      <div className="bg-gray-50 p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingItem ? "Edit Vocabulary" : "Add New Vocabulary"}
        </h3>
        <select
          name="sectionId"
          value={selectedUnitId}
          onChange={(e) => setSelectedUnitId(e.target.value)}
          className="w-full border p-2 rounded text-gray-800"
        >
          <option value="">-- Choose Unit --</option>
          {sections.flatMap((section) =>
            units
              .filter((u) => u.sectionId === section.id)
              .map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {section.title} | {unit.name || `Unit ${unit.id}`} (
                  {unit.grammarPoint})
                </option>
              ))
          )}
        </select>
        <input
          name="word"
          placeholder="Word"
          value={formData.word}
          onChange={handleInputChange}
          className="w-full border p-2 rounded text-[#000]"
        />
        <input
          name="definition"
          placeholder="Definition"
          value={formData.definition}
          onChange={handleInputChange}
          className="w-full border p-2 rounded  text-[#000]"
        />
        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={formData.imageUrl}
          onChange={handleInputChange}
          className="w-full border p-2 rounded  text-[#000]"
        />
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="h-20 object-contain border rounded"
          />
        )}
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editingItem ? "Update" : "Create"}
          </button>
          {editingItem && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-600 underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Tree View */}
      <div className="space-y-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Vocabulary by Section & Unit
        </h3>
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h4 className="text-md font-bold text-indigo-800">
              {section.title} ({section.cefr})
            </h4>
            {units
              .filter((unit) => unit.sectionId === section.id)
              .map((unit) => (
                <div key={unit.id} className="ml-4 space-y-2">
                  <h5 className="text-sm font-semibold text-gray-800">
                    {unit.name || `Unit ${unit.id}`} ? {unit.grammarPoint}
                  </h5>
                  {vocabByUnit[unit.id]?.length ? (
                    <ul className="space-y-2">
                      {vocabByUnit[unit.id].map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center border p-3 rounded bg-white shadow-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.word}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.definition}
                            </p>
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.word}
                                className="h-12 mt-1"
                              />
                            )}
                          </div>
                          <div className="space-x-2">
                            <button
                              onClick={() => handleEdit(item, unit.id)}
                              className="text-sm text-indigo-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, unit.id)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 ml-2">
                      No vocabulary yet.
                    </p>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
