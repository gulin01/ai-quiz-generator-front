// src/components/ManageStories.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Story } from "../page";
import {
  createStory,
  deleteStory,
  generateStory,
  updateStory,
} from "../_api/story.api";
import { getAllUnits, Unit } from "../_api/units.api";
import { Select } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import { Section } from "./ManageSections";
import { getAllSections } from "../_api/section.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";

interface StoryForm {
  title: string;
  content: string;
  audioUrl?: string;
  unitId?: number;
  keywords: string;
}

export default function ManageStories({
  stories: initialStories,
}: {
  stories: Story[];
}) {
  const [activeTab, setActiveTab] = useState<string>("generate");

  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  // Generate story state
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [preview, setPreview] = useState<Story | null>(null);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Manage stories state
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState<StoryForm>({
    title: "",
    content: "",
    audioUrl: "",
    unitId: undefined,
    keywords: "",
  });

  // load sections & units
  useEffect(() => {
    getAllSections()
      .then((secs) => {
        setSections(secs);
        if (secs.length) setSelectedSection(secs[0].id.toString());
      })
      .catch(console.error);
    getAllUnits().then(setUnits).catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = units.filter(
      (u) => u.sectionId.toString() === selectedSection
    );
    setUnitId(filtered.length ? filtered[0].id.toString() : "");
  }, [selectedSection, units]);

  // GENERATE STORY HANDLERS
  const handleGenerate = async () => {
    if (!unitId) return;
    setGenLoading(true);
    setGenError(null);
    setPreview(null);

    console.log("Generating story for unit:", unitId);
    try {
      const story = await generateStory(Number(unitId), { theme, length });
      setPreview(story);
    } catch (err) {
      console.error(err);
      setGenError("Failed to generate story");
    } finally {
      setGenLoading(false);
    }
  };

  // const savePreview = async () => {
  //   if (!preview) return;
  //   try {
  //     const saved = await createStory({ ...preview, unit: preview.unitId });
  //     setStories((prev) => [...prev, saved]);
  //     setPreview(null);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // MANAGE STORIES HANDLERS (reuse existing)
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      audioUrl: "",
      unitId: undefined,
      keywords: "",
    });
    setEditingStory(null);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        audioUrl: formData.audioUrl || undefined,
        unitId: formData.unitId,
        keywords: formData.keywords || undefined,
      };
      let updated: Story;
      if (editingStory) {
        // updated = await updateStory(editingStory.id, payload);
        // setStories((prev) =>
        //   prev.map((s) => (s.id === updated.id ? updated : s))
        // );
      } else {
        // updated = await createStory(payload);
        // setStories((prev) => [...prev, updated]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save story:", error);
    }
  };
  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      content: story.content,
      audioUrl: story.audioUrl || "",
      unitId: story.unitId,
      keywords: story.keywords[0] || "",
    });
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">Story Manager</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-200 rounded-full p-1 flex space-x-2">
          <TabsTrigger
            value="generate"
            className="px-4 py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow"
          >
            Generate Story
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="px-4 py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow"
          >
            All Stories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6 space-y-6">
          {/* Generate Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                className="w-full text-[#000]"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id.toString()}>
                    {sec.title} ({sec.cefr})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <Select
                value={unitId}
                onValueChange={setUnitId}
                className="w-full text-[#000]"
              >
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
              <label className="block text-sm font-medium text-gray-700">
                Theme (optional)
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. mystery"
                className="w-full border rounded px-3 py-2 text-[#000] text-[#000]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Length
              </label>
              <Select
                value={length}
                onValueChange={(val) => setLength(val as any)}
                className="w-full text-[#000]"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </Select>
            </div>
          </div>
          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={genLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {genLoading ? "Generating…" : "Generate Story"}
            </Button>
          </div>
          {genError && <p className="text-red-600 text-center">{genError}</p>}

          {/* Preview & Save */}
          {preview && (
            <Card className="bg-gray-50 p-6 rounded-lg shadow">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  {preview.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {preview.content}
                </p>
                {preview.audioUrl && (
                  <audio controls className="mt-4 w-full">
                    <source src={preview.audioUrl} />
                  </audio>
                )}
                {preview.keywords && (
                  <p className="mt-4 text-sm text-indigo-700">
                    Keywords: {preview.keywords}
                  </p>
                )}
                <div className="mt-6 text-center">
                  <Button
                    // onClick={savePreview}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="mt-6 space-y-6">
          <div className="border rounded p-4 bg-white shadow">
            <h3 className="text-lg font-medium mb-3 text-gray-900">
              All Stories
            </h3>
            {stories.length === 0 ? (
              <p className="text-gray-500 text-sm">No stories found.</p>
            ) : (
              <ul className="space-y-4">
                {stories.map((story) => (
                  <li key={story.id} className="border p-4 rounded bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="text-md font-semibold text-gray-900">
                          {story.title}
                        </h4>
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {story.content}
                        </p>
                        {story.audioUrl && (
                          <audio controls className="mt-2 w-full">
                            <source src={story.audioUrl} />
                          </audio>
                        )}
                        {story.keywords && (
                          <p className="text-sm text-indigo-700">
                            Keywords: {story.keywords}
                          </p>
                        )}
                      </div>
                      <div className="space-x-2 flex ">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(story)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(story.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
