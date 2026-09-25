import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { Plus, Loader2 } from "lucide-react";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";

export default function NotesSection() {
  const { projectId } = useParams();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get(`/notes/${projectId}`);
        setNotes(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        setError("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) fetchNotes();
  }, [projectId]);

  const handleAddClick = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (selectedNote) {
        const response = await api.put(`/notes/${projectId}/n/${selectedNote._id}`, noteData);
        const updatedNote = response.data.data || response.data;
        setNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));
      } else {
        const response = await api.post(`/notes/${projectId}`, noteData);
        const newNote = response.data.data || response.data;
        setNotes(prev => [newNote, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save note", err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setNotes(prev => prev.filter(n => n._id !== noteId));
      await api.delete(`/notes/${projectId}/n/${noteId}`);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  if (isLoading) return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;
  if (error) return <div className="text-rose-400 py-12">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-100">Project Notes</h2>
          <p className="text-sm text-zinc-500">Document your thoughts, schemas, and meeting notes.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <NoteCard 
            key={note._id} 
            note={note} 
            onEditClick={handleEditClick} 
          />
        ))}

        {notes.length === 0 && (
          <div className="col-span-full py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-zinc-500">
            <p>No notes yet. Click 'Add Note' to create one.</p>
          </div>
        )}
      </div>

      {/* Reusable Form Modal */}
      <NoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedNote}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
