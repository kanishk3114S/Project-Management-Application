import { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";

export default function AddMemberModal({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      await onInvite({ email, role });
      setEmail("");
      setRole("member");
      onClose();
    } catch (err) {
      // handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-50">Invite Member</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-zinc-500" />
              </div>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                placeholder="colleague@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={isLoading || !email.trim()} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg flex items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
