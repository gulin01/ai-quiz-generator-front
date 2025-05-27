"use client";

import { useState, useEffect } from "react";
import { Section, Unit } from "./ManageSections";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitQuizzes,
  Quiz,
  updateUnit,
} from "../_api/units.api";
import { getAllSections } from "../_api/section.api";

interface Props {
  units: Unit[];
}

export default function ManageUnits({ units: initialUnits }: Props) {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    grammarPoint: "",
    sectionId: "",
    order: "1",
  });

  // Fetch sections and latest units
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionRes, unitRes] = await Promise.all([
          getAllSections(),
          getAllUnits(),
        ]);
        setSections(sectionRes);
        setUnits(unitRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingUnit(null);
    setFormData({ name: "", grammarPoint: "", sectionId: "", order: "1" });
  };

  const handleSubmit = async () => {
    if (!formData.grammarPoint || !formData.name || !formData.sectionId) return;

    const payload = {
      name: formData.name,
      grammarPoint: formData.grammarPoint,
      sectionId: parseInt(formData.sectionId),
      order: parseInt(formData.order),
    };

    try {
      if (editingUnit) {
        await updateUnit(editingUnit.id, payload);
      } else {
        await createUnit(payload);
      }
      const updated = await getAllUnits();
      setUnits(updated);
      resetForm();
    } catch (error) {
      console.error("Failed to save unit", error);
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      grammarPoint: unit.grammarPoint,
      sectionId: unit.sectionId.toString(),
      order: unit.order.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this unit and all its quizzes and vocab?")) return;

    try {
      await deleteUnit(id);
      setUnits(units.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Failed to delete unit", error);
    }
  };

  const toggleExpand = async (unitId: number) => {
    if (expandedUnitId === unitId) {
      setExpandedUnitId(null);
    } else {
      try {
        const data = await getUnitQuizzes(unitId);
        setExpandedUnitId(unitId);
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to load quizzes", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-indigo-800">Units</h2>

      {/* Form */}
      <div className="bg-gray-50 p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-medium text-[#000]">
          {editingUnit ? "Edit Unit" : "Add New Unit"}
        </h3>
        <input
          name="name"
          placeholder="Unit Name (e.g., At the Zoo)"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded text-[#000]"
        />
        <input
          name="grammarPoint"
          placeholder="Grammar Point (e.g., Modals: can/could)"
          value={formData.grammarPoint}
          onChange={handleChange}
          className="w-full border p-2 rounded text-[#000]"
        />
        <select
          name="sectionId"
          value={formData.sectionId}
          onChange={handleChange}
          className="w-full border p-2 rounded text-[#000]"
        >
          <option value="">-- Select Section --</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.cefr})
            </option>
          ))}
        </select>
        <input
          name="order"
          type="number"
          min={1}
          value={formData.order}
          onChange={handleChange}
          className="w-full border p-2 rounded text-[#000]"
        />
        <div className="flex space-x-4 text-[#000]">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editingUnit ? "Update" : "Create"}
          </button>
          {editingUnit && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Unit List */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-[#000]">All Units</h3>
        <ul className="space-y-3">
          {units.map((unit) => (
            <li key={unit.id} className="border p-4 rounded shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{unit.name}</h4>
                  <p className="text-sm text-gray-600">
                    Grammar: {unit.grammarPoint} | Section ID: {unit.sectionId}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(unit)}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleExpand(unit.id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {expandedUnitId === unit.id
                      ? "Hide Quizzes"
                      : "View Quizzes"}
                  </button>
                </div>
              </div>

              {expandedUnitId === unit.id && (
                <div className="mt-3 pl-4 border-l">
                  {quizzes.length === 0 ? (
                    <p className="text-sm text-gray-500">No quizzes found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {quizzes.map((q) => (
                        <li key={q.id} className="text-sm text-gray-700">
                          ? {q.question} ({q.type}, {q.mode})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
