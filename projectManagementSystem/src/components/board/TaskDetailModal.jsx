import { X, Trash2, Edit2, AlignLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import SubtaskList from "./SubtaskList";

export default function TaskDetailModal({ isOpen, onClose, task, onDelete, onEdit, onTaskUpdate }) {
  const { projectId } = useParams();

  if (!isOpen || !task) return null;

  const handleSubtasksChange = (updatedSubtasks) => {
    if (onTaskUpdate) {
      onTaskUpdate({ ...task, subtasks: updatedSubtasks });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              {task.status?.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { onClose(); onEdit(task); }} 
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { onDelete(task._id); }} 
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
            <button onClick={onClose} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {task.title}
          </h2>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <AlignLeft className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              Description
            </div>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
              {task.description || "No description provided for this task."}
            </div>
          </div>

          {/* Subtasks Component */}
          <SubtaskList 
            projectId={projectId} 
            taskId={task._id} 
            initialSubtasks={task.subtasks || []} 
            onSubtasksChange={handleSubtasksChange}
          />
        </div>
      </div>
    </div>
  );
}
