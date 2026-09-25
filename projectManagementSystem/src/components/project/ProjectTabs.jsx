import { Layout, FileText, Users, Settings } from "lucide-react";

export default function ProjectTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "board", label: "Board", icon: Layout },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "members", label: "Members", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="border-b border-white/5 mb-8 w-full overflow-x-auto hide-scrollbar">
      <nav className="flex items-center gap-6 min-w-max pb-[1px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
