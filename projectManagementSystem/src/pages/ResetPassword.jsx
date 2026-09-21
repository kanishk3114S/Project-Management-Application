import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Triangle, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams(); // Pre-backend, this is just for show
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[400px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-400 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Triangle className="w-5 h-5 text-white fill-current" strokeWidth={2} />
          </Link>
          <h2 className="text-2xl font-semibold text-zinc-50 tracking-tight">Set new password</h2>
          <p className="text-sm text-zinc-400 mt-2 text-center">
            Must be at least 6 characters long.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 border-t-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-zinc-300">
                Your password has been successfully reset.
              </p>
              <Link 
                to="/login"
                className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-lg px-4 py-2.5 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Log in to continue
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">New Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-lg px-4 py-2.5 mt-4 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
