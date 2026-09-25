import { FolderGit2, Edit2 } from "lucide-react";

export default function ProjectHeader({ project, onEditClick }) {
  if (!project) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mt-1 shrink-0">
          <FolderGit2 className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
            {project.name}
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all hover:border-white/10 shrink-0"
      >
        <Edit2 className="w-4 h-4" />
        Edit Project
      </button>
    </div>
  );
}
