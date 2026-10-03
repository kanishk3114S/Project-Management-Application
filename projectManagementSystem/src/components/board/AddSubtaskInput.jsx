import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export default function AddSubtaskInput({ onAdd }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isAdding) return;

    setIsAdding(true);
    try {
      await onAdd(title.trim());
      setTitle("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new sub-task..."
          className="w-full bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
        />
      </div>
      <button
        type="submit"
        disabled={!title.trim() || isAdding}
        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm shrink-0"
      >
        {isAdding ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </>
        )}
      </button>
    </form>
  );
}
