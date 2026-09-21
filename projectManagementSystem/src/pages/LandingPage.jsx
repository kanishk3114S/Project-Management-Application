import { Link } from "react-router-dom";
import { ArrowRight, LayoutTemplate, ShieldCheck, Activity } from "lucide-react";
import Navbar from "../components/common/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Background Glow & Grid */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/djpkzt2k2/image/upload/v1701389710/grid-pattern_q5mvk8.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center relative z-10">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-white/5 text-xs font-medium text-zinc-400 mb-4 backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            ProjectCamp v1.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
            Absolute clarity for <br className="hidden md:block" /> your product team.
          </h1>
          
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ProjectCamp brings your team's tasks, subtasks, and notes together in one unified, flawlessly designed workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              to="/register" 
              className="group flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
            >
              Start building
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-900 transition-colors" />
            </Link>
            <a 
              href="#features" 
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 rounded-full font-medium transition-all hover:-translate-y-0.5"
            >
              Explore features
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="grid md:grid-cols-3 gap-6 max-w-5xl mt-32 text-left">
          {/* Card 1 */}
          <div className="group bg-zinc-900/50 border border-white/5 border-t-white/10 rounded-2xl p-8 hover:-translate-y-1 hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-300 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Hierarchical Architecture</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Break down monumental scopes into manageable tasks and highly detailed subtasks seamlessly.</p>
          </div>

          {/* Card 2 */}
          <div className="group bg-zinc-900/50 border border-white/5 border-t-white/10 rounded-2xl p-8 hover:-translate-y-1 hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-300 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Role-Based Access Control</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Securely collaborate with granular permission tiers for Project Admins and standard Members.</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-zinc-900/50 border border-white/5 border-t-white/10 rounded-2xl p-8 hover:-translate-y-1 hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-300 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Real-Time Velocity</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Track task trajectories from Todo to In Progress to Done with instant, satisfying visual feedback.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5 mt-auto relative z-10">
        <p className="text-xs font-medium text-zinc-600">
          &copy; {new Date().getFullYear()} ProjectCamp. Designed for precision.
        </p>
      </footer>
    </div>
  );
}
