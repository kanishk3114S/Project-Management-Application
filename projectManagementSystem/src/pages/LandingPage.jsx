import { Link } from "react-router-dom";
import { ArrowRight, LayoutTemplate, ShieldCheck, Activity } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col  relative overflow-hidden">
      {/* Background Glow & Grid */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/djpkzt2k2/image/upload/v1701389710/grid-pattern_q5mvk8.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
    <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center relative z-10">
        {/* Adjusted Background Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-400/15 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen -z-10" />

        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-zinc-900/50 border border-stone-200/60 dark:border-white/5 text-xs font-medium text-stone-600 dark:text-zinc-400 mb-4 backdrop-blur-md shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            ProjectCamp v1.0 is now live
          </div>
          
          {/* Headline Contrast Fix */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-stone-900 to-stone-600 dark:from-white dark:to-zinc-400">
            Absolute clarity for <br className="hidden md:block" /> your product team.
          </h1>
          
          <p className="text-lg text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ProjectCamp brings your team's tasks, subtasks, and notes together in one unified, flawlessly designed workspace.
          </p>
          
          {/* Button Hierarchy Fix */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a 
              href="#features" 
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-full font-medium transition-all shadow-md shadow-stone-900/10 hover:-translate-y-0.5"
            >
              Explore features
            </a>
            <Link 
              to={user ? "/dashboard" : "/register"}
              className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-white/10 rounded-full font-medium transition-all shadow-sm hover:-translate-y-0.5"
            >
              {user ? "Go to Dashboard" : "Start building"}
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 dark:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Elevation Fix */}
        <div id="features" className="grid md:grid-cols-3 gap-6 max-w-5xl mt-32 text-left">
          {/* Card 1 */}
          <div className="group bg-white dark:bg-zinc-900/50 border border-stone-200/60 dark:border-white/5 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300/60 dark:hover:border-white/10 dark:hover:bg-zinc-900/80 transition-all duration-300 shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-zinc-100 mb-2">Hierarchical Architecture</h3>
            <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">Break down monumental scopes into manageable tasks and highly detailed subtasks seamlessly.</p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white dark:bg-zinc-900/50 border border-stone-200/60 dark:border-white/5 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300/60 dark:hover:border-white/10 dark:hover:bg-zinc-900/80 transition-all duration-300 shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-zinc-100 mb-2">Role-Based Access Control</h3>
            <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">Securely collaborate with granular permission tiers for Project Admins and standard Members.</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white dark:bg-zinc-900/50 border border-stone-200/60 dark:border-white/5 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300/60 dark:hover:border-white/10 dark:hover:bg-zinc-900/80 transition-all duration-300 shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-zinc-100 mb-2">Real-Time Velocity</h3>
            <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">Track task trajectories from Todo to In Progress to Done with instant, satisfying visual feedback.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-transparent dark:border-white/5 mt-auto relative z-10">
        <p className="text-xs font-medium text-zinc-600">
          &copy; {new Date().getFullYear()} ProjectCamp. Designed for precision.
        </p>
      </footer>
    </div>
  );
}
