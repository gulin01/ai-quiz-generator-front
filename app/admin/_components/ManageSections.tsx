"use client";
import {
  createSection,
  deleteSection,
  getAllSections,
  updateSection,
} from "@/app/admin/_api/section.api";
import { useState, useEffect } from "react";
import { getAllUnits } from "../_api/units.api";

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

interface Props {
  sections: Section[];
}

export default function ManageSections({ sections: initialSections }: Props) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [units, setUnits] = useState<Unit[]>([]);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    cefr: "A1",
    order: "1",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [unitsRes, sectionsRes] = await Promise.all([
          getAllUnits(),
          getAllSections(),
        ]);
        setUnits(unitsRes);
        setSections(sectionsRes);
      } catch (error) {
        console.error("Failed to fetch units or sections", error);
      }
    }

    fetchData();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ title: "", cefr: "A1", order: "1" });
    setEditingSection(null);
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      cefr: formData.cefr,
      order: parseInt(formData.order),
    };

    try {
      if (editingSection) {
        await updateSection(editingSection.id, payload);
      } else {
        await createSection(payload);
      }

      const updatedSections = await getAllSections();
      setSections(updatedSections);
      resetForm();
    } catch (error) {
      console.error("Failed to submit section", error);
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      cefr: section.cefr,
      order: section.order.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    const hasUnits = units.some((u) => u.sectionId === id);
    if (hasUnits) {
      alert("Cannot delete section that has linked units.");
      return;
    }

    if (!confirm("Delete this section?")) return;

    try {
      await deleteSection(id);
      setSections(sections.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  const getUnitCount = (sectionId: number) =>
    units?.filter((u) => u.sectionId === sectionId).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-indigo-900">섹션 관리</h2>
      {/* Form */}
      <div className="bg-gray-50 p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingSection ? "Edit Section" : "Add New Section"}
        </h3>
        <input
          name="title"
          placeholder="Section Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-800 placeholder-gray-500"
        />
        <select
          name="cefr"
          value={formData.cefr}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-800"
        >
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <input
          name="order"
          type="number"
          min={1}
          value={formData.order}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-800"
        />
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editingSection ? "Update" : "Create"}
          </button>
          {editingSection && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-600 underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Section List */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-2">
          All Sections
        </h3>
        <ul className="space-y-3">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <li
                key={section.id}
                className="border p-4 rounded shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-800">
                      CEFR: {section.cefr} | Order: {section.order} | Units:{" "}
                      {getUnitCount(section.id)}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
