import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { UserPlus, Shield, User, Trash2, Loader2 } from "lucide-react";
import AddMemberModal from "./AddMemberModal";
import MemberRoleDropdown from "./MemberRoleDropdown";

export default function MembersList({ projectId: propProjectId }) {
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId;
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/members`);
        setMembers(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error("Fetch members error:", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to load members");
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) fetchMembers();
  }, [projectId]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Optimistic update
      setMembers(prev => 
        prev.map(m => m.user._id === userId ? { ...m, role: newRole } : m)
      );
      await api.put(`/projects/${projectId}/members/${userId}`, { role: newRole });
    } catch (err) {
      console.error("Failed to update role", err);
      // Revert optional
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      setMembers(prev => prev.filter(m => m.user._id !== userId));
      await api.delete(`/projects/${projectId}/members/${userId}`);
    } catch (err) {
      console.error("Failed to remove member", err);
    }
  };

  const handleInviteMember = async (inviteData) => {
    try {
      // { email, role }
      const response = await api.post(`/projects/${projectId}/members`, inviteData);
      
      // Since AddMemberProject returns the ProjectMember but without the user populated fully like getProjectMembers,
      // the safest way to ensure the UI is consistent is to re-fetch the members list.
      const fetchResponse = await api.get(`/projects/${projectId}/members`);
      setMembers(Array.isArray(fetchResponse.data.data) ? fetchResponse.data.data : []);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to invite member", err);
      throw err;
    }
  };

  if (isLoading) return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;
  if (error) return <div className="text-rose-400 py-12">{error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-100">Project Members</h2>
          <p className="text-sm text-zinc-500">Manage who has access to this project workspace.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Members List Box */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
        <ul className="divide-y divide-white/5">
          {members.map(member => {
            const user = member.user || {};
            const displayName = user.fullName || user.username || "User";
            return (
            <li key={user._id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors group">
              
              {/* Avatar and Info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-indigo-500/20 text-indigo-400">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-zinc-200">{displayName}</h4>
                    {member.role === 'admin' ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-semibold text-zinc-400 bg-zinc-500/10 px-1.5 py-0.5 rounded border border-zinc-500/20">
                        <User className="w-3 h-3" /> Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">@{user.username || "unknown"}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <MemberRoleDropdown 
                  currentRole={member.role} 
                  onChange={(newRole) => handleRoleChange(user._id, newRole)}
                />
                
                <button 
                  onClick={() => handleRemoveMember(user._id)}
                  className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </li>
          )})}
        </ul>

        {members.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            No members found.
          </div>
        )}
      </div>

      <AddMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInviteMember}
      />
    </div>
  );
}
