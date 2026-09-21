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
              <span className="text-sm font-medium text-zinc-500">{user.name}</span>
              <button 
                onClick={logout}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Logout
              </button>
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
