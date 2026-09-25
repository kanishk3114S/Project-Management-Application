import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import AddSubtaskInput from "./AddSubtaskInput";
import api from "../../api/axios";

export default function SubtaskList({ projectId, taskId, initialSubtasks = [] }) {
  const [subtasks, setSubtasks] = useState(initialSubtasks);

  useEffect(() => {
    setSubtasks(initialSubtasks);
  }, [initialSubtasks]);

  const handleToggle = async (subtaskId, currentStatus) => {
    try {
      // Optimistic
      setSubtasks(prev =>
        prev.map(st => (st._id === subtaskId ? { ...st, isCompleted: !currentStatus } : st))
      );
      await api.put(`/tasks/${projectId}/st/${subtaskId}`, { isCompleted: !currentStatus });
    } catch (err) {
      console.error(err);
      // Revert
      setSubtasks(prev =>
        prev.map(st => (st._id === subtaskId ? { ...st, isCompleted: currentStatus } : st))
      );
    }
  };

  const handleAdd = async (title) => {
    try {
      const response = await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, { title });
      const newSubtask = response.data.data || response.data;
      setSubtasks([...subtasks, newSubtask]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, subtaskId) => {
    e.stopPropagation();
    try {
      setSubtasks(prev => prev.filter(st => st._id !== subtaskId));
      await api.delete(`/tasks/${projectId}/st/${subtaskId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = subtasks.filter(st => st.isCompleted).length;
  const progress = subtasks.length === 0 ? 0 : Math.round((completedCount / subtasks.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-200">Sub-tasks</h4>
        <span className="text-xs text-zinc-500">{completedCount} / {subtasks.length} ({progress}%)</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2 mt-4">
        {subtasks.map((st) => (
          <div 
            key={st._id} 
            onClick={() => handleToggle(st._id, st.isCompleted)}
            className="flex items-start justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
          >
            <div className="flex items-start gap-3">
              <button className="mt-0.5 text-zinc-500 group-hover:text-indigo-400 transition-colors">
                {st.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>
              <span className={`text-sm ${st.isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                {st.title}
              </span>
            </div>
            <button 
              onClick={(e) => handleDelete(e, st._id)}
              className="text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <AddSubtaskInput onAdd={handleAdd} />
    </div>
  );
}
