import { FileText, Edit3 } from "lucide-react";

export default function NoteCard({ note, onEditClick }) {
  // Derive title from content since backend only has content
  const displayTitle = note.content ? note.content.substring(0, 30).split('\n')[0] + "..." : "New Note";

  return (
    <div className="group relative bg-zinc-900 border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-zinc-800/80 transition-all shadow-sm flex flex-col h-48">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1">{displayTitle}</h3>
        </div>
        <button 
          onClick={() => onEditClick(note)}
          className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <p className="text-xs text-zinc-400 line-clamp-4 leading-relaxed flex-1 whitespace-pre-wrap">
        {note.content}
      </p>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Last edited {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Just now'}</span>
      </div>
    </div>
  );
}
