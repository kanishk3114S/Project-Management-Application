import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BoardColumn from "./BoardColumn";
import TaskModal from "./TaskModal";
import TaskDetailModal from "./TaskDetailModal";
import { Loader2 } from "lucide-react";

export default function Board() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks/${projectId}`);
        // Backend returns response.data.data
        setTasks(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) fetchTasks();
  }, [projectId]);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState("todo");

  // Drag and Drop Handlers
  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic UI Update
    setTasks(prevTasks => 
      prevTasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t)
    );

    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert if failed
      setTasks(prevTasks => 
        prevTasks.map(t => t._id === taskId ? { ...t, status: task.status } : t)
      );
    }
  };

  // Task Actions
  const handleAddTaskClick = (status) => {
    setSelectedTask(null);
    setDefaultStatusForNewTask(status);
    setIsFormModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsFormModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      await api.delete(`/tasks/${projectId}/t/${taskId}`);
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      // Backend expects title, description, assignedTo (optional), status
      if (selectedTask) {
        // Edit
        const response = await api.put(`/tasks/${projectId}/t/${selectedTask._id}`, taskData);
        const updatedTask = response.data.data || response.data;
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      } else {
        // Create
        const response = await api.post(`/tasks/${projectId}`, {
          ...taskData,
          status: defaultStatusForNewTask
        });
        const newTask = response.data.data || response.data;
        setTasks(prev => [newTask, ...prev]);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;
  if (error) return <div className="text-rose-400 p-4">{error}</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto hide-scrollbar pb-6 flex items-start gap-6">
        <BoardColumn 
          title="To Do" 
          status="todo" 
          tasks={tasks.filter(t => t.status === "todo")}
          onDrop={handleDrop}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTaskClick}
        />
        <BoardColumn 
          title="In Progress" 
          status="in_progress" 
          tasks={tasks.filter(t => t.status === "in_progress")}
          onDrop={handleDrop}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTaskClick}
        />
        <BoardColumn 
          title="Done" 
          status="done" 
          tasks={tasks.filter(t => t.status === "done")}
          onDrop={handleDrop}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTaskClick}
        />
      </div>

      <TaskModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedTask}
        defaultStatus={defaultStatusForNewTask}
        onSave={handleSaveTask}
      />

      {selectedTask && (
        <TaskDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          task={selectedTask}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
