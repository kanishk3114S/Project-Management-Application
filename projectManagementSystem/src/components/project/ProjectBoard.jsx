import { Layout } from "lucide-react";

export default function ProjectBoard() {
  return (
    <div className="border border-dashed border-white/10 rounded-2xl bg-zinc-900/30 p-12 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
        <Layout className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">Project Board</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
        Kanban board coming soon. Here you will be able to manage your tasks across TODO, IN PROGRESS, and DONE.
      </p>
      <button className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:border-white/10">
        + Add Task
      </button>
    </div>
  );
}
