import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Trash2, ListCheck } from "lucide-react";
import AddSubtaskInput from "./AddSubtaskInput";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function SubtaskList({ projectId, taskId, initialSubtasks = [], onSubtasksChange }) {
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const { addToast } = useToast();

  useEffect(() => {
    setSubtasks(initialSubtasks);
  }, [initialSubtasks]);

  const updateParentState = (updatedList) => {
    setSubtasks(updatedList);
    if (onSubtasksChange) {
      onSubtasksChange(updatedList);
    }
  };

  const handleToggle = async (subtaskId, currentStatus) => {
    const updated = subtasks.map(st => 
      st._id === subtaskId ? { ...st, isCompleted: !currentStatus } : st
    );
    updateParentState(updated);

    try {
      await api.put(`/tasks/${projectId}/st/${subtaskId}`, { isCompleted: !currentStatus });
    } catch (err) {
      console.error("Failed to toggle subtask:", err);
      // Revert if error
      updateParentState(subtasks);
      addToast(err.response?.data?.message || "Failed to update subtask status", "error");
    }
  };

  const handleAdd = async (title) => {
    try {
      const response = await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, { title });
      const newSubtask = response.data.data || response.data;
      const updated = [...subtasks, newSubtask];
      updateParentState(updated);
      addToast("Subtask added successfully", "success");
    } catch (err) {
      console.error("Failed to add subtask:", err);
      addToast(err.response?.data?.message || "Failed to add subtask", "error");
      throw err;
    }
  };

  const handleDelete = async (e, subtaskId) => {
    e.stopPropagation();
    const updated = subtasks.filter(st => st._id !== subtaskId);
    updateParentState(updated);

    try {
      await api.delete(`/tasks/${projectId}/st/${subtaskId}`);
      addToast("Subtask deleted", "success");
    } catch (err) {
      console.error("Failed to delete subtask:", err);
      // Revert if error
      updateParentState(subtasks);
      addToast(err.response?.data?.message || "Failed to delete subtask", "error");
    }
  };

  const completedCount = subtasks.filter(st => st.isCompleted).length;
  const progress = subtasks.length === 0 ? 0 : Math.round((completedCount / subtasks.length) * 100);

  return (
    <div className="space-y-4 bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          <ListCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Sub-tasks</span>
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {completedCount} of {subtasks.length} completed ({progress}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Subtasks List */}
      <div className="space-y-1.5 mt-3 max-h-60 overflow-y-auto hide-scrollbar">
        {subtasks.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 py-2 italic text-center">
            No sub-tasks added yet. Add one below!
          </p>
        ) : (
          subtasks.map((st) => (
            <div 
              key={st._id} 
              onClick={() => handleToggle(st._id, st.isCompleted)}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer group transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/5"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button 
                  type="button"
                  className="text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0"
                >
                  {st.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  )}
                </button>
                <span className={`text-sm truncate ${st.isCompleted ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-800 dark:text-zinc-200 font-medium'}`}>
                  {st.title}
                </span>
              </div>
              <button 
                type="button"
                onClick={(e) => handleDelete(e, st._id)}
                className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-all rounded"
                title="Delete subtask"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Subtask Input Form */}
      <AddSubtaskInput onAdd={handleAdd} />
    </div>
  );
}
