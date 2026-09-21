import { useState } from "react";
import { Link } from "react-router-dom";
import { Triangle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[400px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-400 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Triangle className="w-5 h-5 text-white fill-current" strokeWidth={2} />
          </Link>
          <h2 className="text-2xl font-semibold text-zinc-50 tracking-tight">Log in to ProjectCamp</h2>
          <p className="text-sm text-zinc-400 mt-2">Welcome back to your workspace</p>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 border-t-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-zinc-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-lg px-4 py-2.5 mt-2 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-zinc-300 hover:text-white font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
