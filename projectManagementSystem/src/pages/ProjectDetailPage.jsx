import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { ChevronLeft, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectTabs from "../components/project/ProjectTabs";
import EditProjectModal from "../components/project/EditProjectModal";

// Tab Contents
import ProjectBoard from "../components/project/ProjectBoard";
import ProjectNotes from "../components/project/ProjectNotes";
import ProjectMembers from "../components/project/ProjectMembers";
import ProjectSettings from "../components/project/ProjectSettings";

export default function ProjectDetailPage() {
  const { projectId } = useParams(); //IT takes the user id from the params and takes the data//
  
  const { projects, updateProject } = useProjects();
  
  // State
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState("board");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch project data from context
  useEffect(() => {
    setIsLoading(true);
    
    // Small delay for UI smoothness
    const timer = setTimeout(() => {
      if (projectId) {
        const found = projects.find(p => p._id === projectId || p.id === projectId);
        if (found) {
          setProject(found);
          setError(null);
        } else {
          setError("Project not found. It may have been deleted.");
        }
        setIsLoading(false);
      } else {
        setError("Project ID not found");
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [projectId, projects]);

  // Update project locally after editing
  const handleSaveProject = async (updatedProject) => {
    try {
      await updateProject(updatedProject._id || updatedProject.id, updatedProject);
      setProject(updatedProject);
    } catch (err) {
      console.error(err);
    }
  };

  // Conditional Rendering for active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "board":
        return <ProjectBoard />;
      case "notes":
        return <ProjectNotes />;
      case "members":
        return <ProjectMembers />;
      case "settings":
        return <ProjectSettings />;
      default:
        return <ProjectBoard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12">
          <div className="text-red-400">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 pt-28 sm:pt-32 pb-12">
        {/* Back navigation */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors mb-6 sm:mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Header (Avatar, Name, Edit Button) */}
        <ProjectHeader 
          project={project} 
          onEditClick={() => setIsEditModalOpen(true)} 
        />

        {/* Project Navigation Tabs */}
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Tab Content */}
        {/* now the preojctTab has changed---> activeTab [default =="board"]  */}
        <div className="mt-8 animate-in fade-in duration-300">
          {renderActiveTabContent()}
        </div>
      </main>

      {/* Edit Modal */}
      <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={handleSaveProject}
      />
    </div>
  );
}
