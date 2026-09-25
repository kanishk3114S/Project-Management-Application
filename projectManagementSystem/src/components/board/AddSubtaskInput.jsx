import { useState } from "react";
import { Plus } from "lucide-react";

export default function AddSubtaskInput({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a sub-task..."
        className="flex-1 bg-zinc-950/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
      </button>
    </form>
  );
}
