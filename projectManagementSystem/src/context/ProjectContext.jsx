import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all projects when the app loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        // Extract array from backend ApiResponse structure (response.data.data)
        setProjects(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      const newProject = response.data.data;
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (error) {
      console.error("Failed to add project:", error);
      throw error;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      // Optimistic UI Update (Update instantly on screen)
      setProjects(prev => prev.map(p => (p._id === projectId || p.id === projectId) ? { ...p, ...updates } : p));
      
      // Real API Call
      await api.put(`/projects/${projectId}`, updates);
    } catch (error) {
      console.error("Failed to update project:", error);
      // Optional: Revert the state if the API fails
    }
  };

  const deleteProject = async (projectId) => {
    try {
      // Optimistic UI Update
      setProjects(prev => prev.filter(p => p._id !== projectId && p.id !== projectId));
      
      // Real API Call
      await api.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, loading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used within ProjectProvider");
  return context;
};
