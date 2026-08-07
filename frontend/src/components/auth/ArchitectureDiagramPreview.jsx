import { Cpu, Database, Cloud, Globe, Sparkles, Layers, ShieldCheck } from "lucide-react";

const ArchitectureDiagramPreview = () => {
  const nodes = [
    {
      id: "frontend",
      title: "Frontend Client Layer",
      tech: "React 19 + Vite + Tailwind CSS",
      icon: Globe,
      color: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/40",
      pill: "Client UI"
    },
    {
      id: "gateway",
      title: "API Gateway & Security",
      tech: "Express / JWT Authorization",
      icon: ShieldCheck,
      color: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
      pill: "Security"
    },
    {
      id: "backend",
      title: "Core Service & AI Engine",
      tech: "Node.js + Google Gemini AI",
      icon: Cpu,
      color: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40",
      pill: "AI Architect"
    },
    {
      id: "database",
      title: "Data Persistence",
      tech: "MongoDB Cluster + Mongoose",
      icon: Database,
      color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
      pill: "Database"
    },
    {
      id: "cloud",
      title: "Cloud Infrastructure",
      tech: "Docker + Cloud Container Engine",
      icon: Cloud,
      color: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/40",
      pill: "Cloud Host"
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/80 dark:bg-slate-900/80 border border-gray-200/80 dark:border-slate-800 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Header pill */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            <Sparkles size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Architecture Blueprint
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">System Ready</span>
        </div>
      </div>

      {/* Nodes visual timeline flow */}
      <div className="space-y-3 relative">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.id}>
              <div className="group relative flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700/80 hover:border-indigo-300 rounded-2xl transition duration-200 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${node.color} border shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {node.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{node.tech}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
                  {node.pill}
                </span>
              </div>

              {/* Connecting arrow line */}
              {index < nodes.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-indigo-300 dark:bg-indigo-800" />
                    <div className="w-1.5 h-1.5 rotate-45 border-r-2 border-b-2 border-indigo-400 -mt-1" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer stats bar */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Layers size={13} className="text-indigo-600 dark:text-indigo-400" /> Multi-tier Microservices
        </span>
        <span>Target Latency &lt; 50ms</span>
      </div>
    </div>
  );
};

export default ArchitectureDiagramPreview;
