import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  
  // State
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState("board");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch project data (Mocking an API call for now)
  useEffect(() => {
    setIsLoading(true);
    
    // Simulating network delay
    const timer = setTimeout(() => {
      if (projectId) {
        // Mock data fetch
        setProject({
          id: projectId,
          name: "Project Workspace",
          description: "This is a detailed view of your selected project workspace.",
          members: 1
        });
        setIsLoading(false);
      } else {
        setError("Project ID not found");
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [projectId]);

  // Update project locally after editing
  const handleSaveProject = (updatedProject) => {
    setProject(updatedProject);
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
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-28 pb-12">
          <div className="text-red-400">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-12">
        {/* Back navigation */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
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
