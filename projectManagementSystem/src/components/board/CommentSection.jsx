import { useState } from "react";
import { Send } from "lucide-react";

export default function CommentSection({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Math.random().toString(36).substring(7),
      author: "You", // Mock author
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, commentObj]);
    setNewComment("");
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-zinc-200">Activity & Comments</h4>

      <div className="space-y-4 max-h-[250px] overflow-y-auto hide-scrollbar pr-2">
        {comments.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                {comment.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-zinc-200">{comment.author}</span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-0.5 leading-relaxed bg-zinc-950/50 p-2.5 rounded-lg rounded-tl-none border border-white/5">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 mt-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={1}
          className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none hide-scrollbar min-h-[42px]"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
