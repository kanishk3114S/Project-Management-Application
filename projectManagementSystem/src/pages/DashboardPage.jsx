import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { FolderGit2, Plus } from "lucide-react";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import ProjectCard from "../components/projects/ProjectCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dummy Projects State (Starts completely empty now!)
  const [projects, setProjects] = useState([]);

  const handleCreateProject = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-12">
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
                Workspace
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Overview</h1>
            <p className="text-sm text-zinc-400">Welcome back, {user?.name}. Here's what's happening.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <div className="border border-dashed border-white/10 rounded-2xl bg-zinc-900/30 p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 mb-6 shadow-inner">
              <FolderGit2 className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">No projects available</h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-8 leading-relaxed">
              Get started by creating a new project workspace. You can invite your team later.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-white/10"
            >
              Create your first project
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */} 

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
