import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useToast } from "../../context/ToastContext";
import { Settings, Globe, Lock, Trash2, AlertTriangle, Image as ImageIcon } from "lucide-react";

export default function ProjectSettings() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjects();
  const { addToast } = useToast();
  
  const project = projects.find(p => p._id === projectId || p.id === projectId) || {};

  const [visibility, setVisibility] = useState(project.visibility || "private");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveVisibility = (newVisibility) => {
    setVisibility(newVisibility);
    updateProject(projectId, { visibility: newVisibility });
    addToast(`Project is now ${newVisibility}.`, "success");
  };

  const handleDelete = () => {
    if (deleteConfirmation !== project.name) return;
    setIsDeleting(true);

    setTimeout(() => {
      deleteProject(projectId);
      addToast("Project deleted successfully.", "info");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-300">
      
      {/* General Settings */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> General Settings
        </h2>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">Project Visibility</h3>
              <p className="text-sm text-zinc-500 mt-1">Control who can find and access this project.</p>
            </div>
            <div className="flex bg-zinc-950 border border-white/10 rounded-lg p-1 shrink-0">
              <button 
                onClick={() => handleSaveVisibility("public")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${visibility === "public" ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Globe className="w-4 h-4" /> Public
              </button>
              <button 
                onClick={() => handleSaveVisibility("private")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${visibility === "private" ? "bg-zinc-800 text-zinc-200 shadow-md" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Lock className="w-4 h-4" /> Private
              </button>
            </div>
          </div>

          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">Cover Image</h3>
              <p className="text-sm text-zinc-500 mt-1">Change the project cover seen on the dashboard.</p>
            </div>
            <button 
              onClick={() => addToast("Cover image upload simulated.", "info")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors border border-white/5 shrink-0"
            >
              <ImageIcon className="w-4 h-4" /> Upload Image
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pt-6">
        <h2 className="text-lg font-medium text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h2>
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-rose-200">Delete Project</h3>
              <p className="text-sm text-rose-400/70 mt-1">Once you delete a project, there is no going back. Please be certain.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 bg-rose-950/20 p-4 rounded-xl border border-rose-500/10">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-rose-300/80 uppercase tracking-wider">
                Type "{project.name}" to confirm
              </label>
              <input 
                type="text" 
                value={deleteConfirmation} 
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full bg-black/40 border border-rose-500/20 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50"
                placeholder={project.name}
              />
            </div>
            <button 
              onClick={handleDelete}
              disabled={deleteConfirmation !== project.name || isDeleting}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-950 disabled:text-rose-500/50 text-white rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed h-[38px] shrink-0"
            >
              {isDeleting ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete</>}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
