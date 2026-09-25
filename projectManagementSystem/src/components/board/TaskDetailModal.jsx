import { X, Trash2, Edit2, AlignLeft, User, Flag } from "lucide-react";
import { useParams } from "react-router-dom";
import SubtaskList from "./SubtaskList";

export default function TaskDetailModal({ isOpen, onClose, task, onDelete, onEdit }) {
  const { projectId } = useParams();

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              {task.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { onClose(); onEdit(task); }} 
              className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { onDelete(task._id); }} 
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-6">{task.title}</h2>
          
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <AlignLeft className="w-4 h-4 text-zinc-400" />
                Description
              </div>
              <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/30 p-4 rounded-xl border border-white/5">
                {task.description || "No description provided."}
              </div>
            </div>

            {/* Subtasks Component */}
            <SubtaskList 
              projectId={projectId} 
              taskId={task._id} 
              initialSubtasks={task.subtasks || []} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
