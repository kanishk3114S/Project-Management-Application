import { Clock, User } from "lucide-react";

export default function TaskCard({ task, onTaskClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => onTaskClick(task)}
      className="group bg-zinc-900 border border-white/5 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-white/10 hover:bg-zinc-800/80 transition-all shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border bg-zinc-800 text-zinc-300 border-white/10">
          Task
        </span>
      </div>

      <h4 className="text-sm font-medium text-zinc-100 mb-2 group-hover:text-indigo-300 transition-colors">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "New"}</span>
        </div>
      </div>
    </div>
  );
}
