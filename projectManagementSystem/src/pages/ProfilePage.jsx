import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ text: "", type: "" });

    try {
      await api.put('/auth/update-account', { fullName, username });
      setProfileMessage({ text: "Profile updated successfully!", type: "success" });
      // The context will update on refresh, or we can just let it be since they might navigate away
    } catch (error) {
      setProfileMessage({ 
        text: error.response?.data?.message || "Failed to update profile", 
        type: "error" 
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      setPasswordMessage({ text: "Password updated successfully!", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({ 
        text: error.response?.data?.message || "Failed to change password", 
        type: "error" 
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-8">
          Account Settings
        </h1>

        <div className="space-y-10">
          {/* Profile Details Section */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden p-6 sm:p-8">
            <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-indigo-400" /> 
              Profile Details
            </h2>

            {profileMessage.text && (
              <div className={`p-3 rounded-lg text-sm mb-6 ${profileMessage.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl font-bold border border-indigo-500/30 shrink-0">
                  {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <button type="button" disabled className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-white/5 opacity-50 cursor-not-allowed flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Change Avatar (Coming Soon)
                  </button>
                  <p className="text-xs text-zinc-500 mt-2">Avatars will be added in a future update.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Email cannot be changed directly.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={isUpdatingProfile || (!fullName && !username)}
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm"
                >
                  {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden p-6 sm:p-8">
            <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-indigo-400" /> 
              Change Password
            </h2>

            {passwordMessage.text && (
              <div className={`p-3 rounded-lg text-sm mb-6 ${passwordMessage.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isUpdatingPassword || !oldPassword || !newPassword || !confirmPassword}
                  className="px-6 py-2.5 bg-zinc-100 hover:bg-white disabled:bg-zinc-300 disabled:text-zinc-500 text-zinc-950 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm"
                >
                  {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                </button>
              </div>
            </form>
          </section>

        </div>
      </main>
    </div>
  );
}
