import { Link } from "react-router-dom";
import { FolderGit2, Users, ShieldAlert } from "lucide-react";

export default function ProjectCard({ project }) {
  const isAdmin = project.role === "admin";

  return (
    <Link 
      to={`/project/${project._id || project.id}`}
      className="group block bg-[#EBE9E0] dark:bg-zinc-900/40 rounded-3xl p-6 hover:-translate-y-1 hover:bg-[#E2DFD3] dark:hover:bg-zinc-900/80 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1A4731]/10 border border-[#1A4731]/20 flex items-center justify-center text-[#1A4731] dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400">
          <FolderGit2 className="w-5 h-5" strokeWidth={1.5} />
        </div>
        {isAdmin && (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
            <ShieldAlert className="w-3 h-3" />
            Admin
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 truncate">
        {project.name}
      </h3>
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-6 h-10">
        {project.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-white/5 text-sm">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Users className="w-4 h-4" />
          <span>{project.members} {project.members === 1 ? 'Member' : 'Members'}</span>
        </div>
        
        <span className="text-[#1A4731] dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
          Open project &rarr;
        </span>
      </div>
    </Link>
  );
}
