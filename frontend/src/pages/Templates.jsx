import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Layers, Sparkles } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { TEMPLATES } from "../data/templates.data";

const CATEGORIES = [
  "All",
  "Web Apps",
  "SaaS",
  "E-commerce",
  "Real-Time",
  "AI / ML",
  "Microservices",
];

const colorStyles = {
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/50",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900/30",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/30",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/50",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900/30",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/30",
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
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/50",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900/30",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/50",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-100 dark:border-pink-900/30",
  },
};

const Templates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory =
      selectedCategory === "All" || t.category === selectedCategory;

    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.suggestedTechnologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    navigate("/dashboard/new", {
      state: {
        template: template.defaults,
        templateName: template.name,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="pb-4 border-b border-gray-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Architecture Templates
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Start with a proven system design and customize it for your requirements.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by technology, name, or use case..."
              className="w-full bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Compact Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200/80 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Layers size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No matching templates found
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              const theme = colorStyles[template.color] || colorStyles.indigo;

              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Icon + Category Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${theme.bg} ${theme.text} border ${theme.border} flex items-center justify-center shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700/80 text-gray-600 dark:text-slate-300">
                          {template.complexity}
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${theme.bg} ${theme.text} border ${theme.border}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>

                    {/* Template Name & Description */}
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Suggested Tech Stack Pills */}
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-1.5">
                        Suggested Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {template.suggestedTechnologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 rounded-md bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles size={14} />
                      <span>Use Template</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Templates;
