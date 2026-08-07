const StatCard = ({ title, value, description, icon: Icon, color = "indigo" }) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/30",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/50",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/30",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/50",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/30",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/30",
    },
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} flex items-center justify-center shrink-0`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {description && (
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;