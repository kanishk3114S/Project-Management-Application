import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

export default function BoardColumn({ title, status, tasks, onDrop, onTaskClick, onAddTask }) {
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(e, status);
  };

  return (
    <div 
      className="flex-shrink-0 w-80 bg-zinc-950/40 dark:bg-zinc-950/40 light:bg-zinc-100/80 rounded-2xl border border-white/5 dark:border-white/5 light:border-zinc-200 flex flex-col max-h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-white/5 dark:border-white/5 light:border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{title}</h3>
          <span className="bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(status)}
          className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-zinc-100 light:hover:text-zinc-900 transition-colors p-1 hover:bg-white/5 light:hover:bg-zinc-200 rounded-md"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Task Area */}
      <div className="p-3 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 min-h-[150px]">
        {tasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onTaskClick={onTaskClick}
            onDragStart={(e, id) => e.dataTransfer.setData("taskId", id)} 
          />
        ))}
        
        {/* Placeholder if empty */}
        {tasks.length === 0 && (
          <div className="h-full min-h-[120px] border-2 border-dashed border-white/5 dark:border-white/5 light:border-zinc-300 rounded-xl flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-500 light:text-zinc-400 font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
