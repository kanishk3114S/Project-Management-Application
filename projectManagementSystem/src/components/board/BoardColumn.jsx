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
      className="flex-shrink-0 w-80 bg-zinc-100/80 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col max-h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
          <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(status)}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1 hover:bg-zinc-200 dark:hover:bg-white/5 rounded-md"
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
          <div className="h-full min-h-[120px] border-2 border-dashed border-zinc-300 dark:border-white/5 rounded-xl flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
