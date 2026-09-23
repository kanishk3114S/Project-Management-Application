import { FolderGit2, Edit2 } from "lucide-react";

export default function ProjectHeader({ project, onEditClick }) {
  if (!project) return null;

  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mt-1">
          <FolderGit2 className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            {project.name}
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:border-white/10"
      >
        <Edit2 className="w-4 h-4" />
        Edit Project
      </button>
    </div>
  );
}
