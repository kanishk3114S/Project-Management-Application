import { Clock, CheckSquare } from "lucide-react";

export default function TaskCard({ task, onTaskClick, onDragStart }) {
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((st) => st.isCompleted).length;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => onTaskClick(task)}
      className="group bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-white/5 dark:border-white/5 light:border-zinc-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/30 dark:hover:border-indigo-500/30 light:hover:border-indigo-400 hover:shadow-md transition-all duration-200 shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-zinc-100 text-zinc-300 dark:text-zinc-300 light:text-zinc-700 border-white/10 dark:border-white/10 light:border-zinc-200">
          {task.status?.replace("_", " ") || "Task"}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5 dark:border-white/5 light:border-zinc-100">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-500">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "New"}</span>
        </div>

        {subtasks.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-50 text-indigo-400 dark:text-indigo-400 light:text-indigo-600 border border-indigo-500/20">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{completedSubtasks}/{subtasks.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
