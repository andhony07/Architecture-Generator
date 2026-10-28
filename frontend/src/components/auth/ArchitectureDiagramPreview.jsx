import { Globe, ShieldCheck, Cpu, Database, Sparkles, Layers } from "lucide-react";

const ArchitectureDiagramPreview = () => {
  const nodes = [
    {
      id: "client",
      title: "Client Application",
      tech: "React 19 • Vite • Tailwind",
      icon: Globe,
      badge: "Client Tier",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/60",
    },
    {
      id: "gateway",
      title: "API Gateway & Auth",
      tech: "Express 5 • JWT Guard • Rate Limiting",
      icon: ShieldCheck,
      badge: "Security",
      badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/60 dark:border-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/60",
    },
    {
      id: "ai-engine",
      title: "AI Synthesis Engine",
      tech: "Google Gemini 2.5 • Fallback Router",
      icon: Cpu,
      badge: "Core AI",
      badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/60",
    },
    {
      id: "data",
      title: "Persistence & Graph Store",
      tech: "MongoDB • Blueprint Specs • User Store",
      icon: Database,
      badge: "Database",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/60",
    },
  ];

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center">
            <Sparkles size={13} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            System Topology Preview
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
            Pipeline Active
          </span>
        </div>
      </div>

      {/* Nodes list */}
      <div className="space-y-1.5">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.id}>
              <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl transition duration-150 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${node.iconColor}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {node.tech}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${node.badgeColor}`}>
                  {node.badge}
                </span>
              </div>

              {index < nodes.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <div className="w-px h-2 bg-indigo-300 dark:bg-indigo-800" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer metadata */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Layers size={12} className="text-indigo-600 dark:text-indigo-400" />
          Multi-Tier Blueprint
        </span>
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
          Latency &lt; 50ms • REST
        </span>
      </div>
    </div>
  );
};

export default ArchitectureDiagramPreview;
