import { Link } from "react-router-dom";
import { Triangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full border-b border-white/5 bg-zinc-950/60 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Triangle className="w-3.5 h-3.5 text-white fill-current" strokeWidth={2} />
          </div>
          <span className="font-medium text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors">
            ProjectCamp
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                Dashboard
              </Link>
              <div className="w-[1px] h-4 bg-white/10"></div>
              
              {/* User Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/30">
                    {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {/* Dropdown Menu (Hover based for clean vibe) */}
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                  <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-white/5 bg-zinc-950/50">
                      <p className="text-sm font-medium text-zinc-200 truncate">{user.fullName || user.username}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email || 'user@example.com'}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/profile" className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-md transition-colors">
                        Profile Settings
                      </Link>
                      <Link to="/billing" className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-md transition-colors">
                        Billing & Plan
                      </Link>
                    </div>
                    <div className="p-1 border-t border-white/5">
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                Log in
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-900 hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
