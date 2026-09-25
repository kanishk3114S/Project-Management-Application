import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function TaskModal({ isOpen, onClose, onSave, initialData, defaultStatus }) {
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    assignedTo: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (isOpen && projectId) {
      api.get(`/projects/${projectId}/members`)
        .then(res => setMembers(res.data.data || []))
        .catch(console.error);
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "todo",
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: defaultStatus || "todo",
        assignedTo: ""
      });
    }
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-50">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Task Title</label>
            <input 
              name="title" required value={formData.title} onChange={handleChange}
              className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="e.g. Design homepage hero section"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} rows={3}
              className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              placeholder="Add more details to this task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Assign To</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50">
                <option value="">Unassigned</option>
                {members.map(member => (
                  <option key={member.user?._id || member._id} value={member.user?._id || member._id}>
                    {member.user?.fullName || member.user?.username || 'Unknown User'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={isLoading || !formData.title.trim()} className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium rounded-lg flex items-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
