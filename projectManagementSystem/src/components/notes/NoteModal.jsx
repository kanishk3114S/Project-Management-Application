import { useState, useEffect } from "react";
import { X, Loader2, Trash2 } from "lucide-react";

export default function NoteModal({ isOpen, onClose, initialData, onSave, onDelete }) {
  const [formData, setFormData] = useState({ content: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ content: initialData.content || "" });
    } else {
      setFormData({ content: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-50">
            {initialData ? "Edit Note" : "Create New Note"}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-[60vh] max-h-[500px]">
          <textarea 
            name="content" required value={formData.content} onChange={handleChange}
            className="w-full flex-1 bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none font-mono"
            placeholder="Write your note here using markdown or plain text..."
          />

          <div className="flex items-center justify-between pt-4 mt-auto">
            {initialData && onDelete ? (
              <button type="button" onClick={() => onDelete(initialData._id)} className="px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : <div></div>}
            
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={isLoading || !formData.content.trim()} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg flex items-center transition-colors">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Note"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
