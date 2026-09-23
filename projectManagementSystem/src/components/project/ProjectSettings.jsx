import { Settings } from "lucide-react";

export default function ProjectSettings() {
  return (
    <div className="border border-dashed border-white/10 rounded-2xl bg-zinc-900/30 p-12 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
        <Settings className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">Project Settings</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
        Configure project preferences, visibility, and danger zone actions.
      </p>
    </div>
  );
}
