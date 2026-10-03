import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/common/Navbar";
import { FolderGit2, Plus } from "lucide-react";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import ProjectCard from "../components/projects/ProjectCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, addProject } = useProjects();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (newProject) => {
    try {
      await addProject(newProject);
      addToast("Project created successfully!", "success");
      setIsModalOpen(false);
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to create project", "error");
    }
  };

  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-12">
        <div className="flex justify-between items-end mb-8 pb-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-1">Overview</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Welcome back, {user?.fullName || user?.username}. Here's what's happening.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#EBE9E0] dark:bg-white text-zinc-900 dark:text-zinc-950 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[#E2DFD3] dark:hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Sentinel-style Banner */}
        <div className="w-full bg-[#1A4731] dark:bg-zinc-900 rounded-3xl p-10 flex flex-col items-center justify-center text-center mb-8 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 mb-4 text-[#D8E6D3] dark:text-indigo-400 opacity-90">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-[#F5F4EF] dark:text-white mb-2">You're all set. Ready to work.</h2>
          <p className="text-xs text-[#9BB3A1] dark:text-zinc-500 font-medium uppercase tracking-widest">
            {projects.length} ACTIVE PROJECTS &bull; UPDATED JUST NOW
          </p>
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <div className="border-none rounded-3xl bg-[#EBE9E0] dark:bg-zinc-900/30 p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E2DFD3] dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-6">
              <FolderGit2 className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">No projects available</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
              Get started by creating a new project workspace. You can invite your team later.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 text-zinc-900 dark:text-zinc-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              Create your first project
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project._id || project.id} project={project} /> //RENDERS THE PROJECT CARD//
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
