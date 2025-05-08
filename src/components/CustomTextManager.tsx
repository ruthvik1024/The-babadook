import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CustomTextManager({
  onSelect,
}: {
  onSelect: (text: string, textId: string) => void;
}) {
  const texts = useQuery(api.texts.listTexts) || [];
  const saveText = useMutation(api.texts.saveText);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    await saveText({ title, content });
    setTitle("");
    setContent("");
  }

  return (
    <div className="bg-zinc-900/80 rounded-lg p-4 shadow text-white">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <span role="img" aria-label="Babadook">👻</span>
        Your Custom Texts
      </h3>
      <form onSubmit={handleSave} className="flex flex-col gap-2 mb-4">
        <input
          className="border rounded p-2 bg-zinc-800 text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border rounded p-2 bg-zinc-800 text-white"
          placeholder="Paste or write your text here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button
          className="bg-indigo-700 text-white rounded px-4 py-2 font-semibold"
          type="submit"
        >
          Save
        </button>
      </form>
      <ul className="space-y-2">
        {texts.map((t) => (
          <li key={t._id}>
            <button
              className="underline text-indigo-300 hover:text-indigo-100"
              onClick={() => onSelect(t.content, t._id)}
            >
              {t.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
