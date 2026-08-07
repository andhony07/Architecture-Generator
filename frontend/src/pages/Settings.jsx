import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Palette,
  User,
  Sliders,
  Check,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [defaultCloud, setDefaultCloud] = useState("No Preference");
  const [defaultDb, setDefaultDb] = useState("No Preference");

  const themeOptions = [
    {
      id: "colorful",
      label: "Colorful",
      description: "Default theme with vibrant semantic color accents and subtle ambient glows.",
      icon: Palette,
      previewBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
    },
    {
      id: "light",
      label: "Light",
      description: "Clean, conservative white and slate surfaces for high clarity.",
      icon: Sun,
      previewBg: "bg-gray-50 border-gray-200 text-blue-600",
    },
    {
      id: "dark",
      label: "Dark",
      description: "Modern dark slate interface optimized for low-light environments.",
      icon: Moon,
      previewBg: "bg-slate-900 border-slate-700 text-indigo-400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="pb-4 border-b border-gray-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            System Settings
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Manage appearance themes, account details, and architecture preferences.
          </p>
        </div>

        {/* Section 1: Appearance & Theme Selector */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Appearance & Theme
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Choose your preferred interface theme. Selection persists across sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 ${
                    isSelected
                      ? "bg-indigo-50/60 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm"
                      : "bg-gray-50/60 dark:bg-slate-900/40 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${opt.previewBg}`}>
                        <Icon size={18} />
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                        {opt.label}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Account Overview */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Account Summary
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Signed in as {user?.name || "Architect"} ({user?.email})
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/profile"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>View Profile</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3 text-xs text-gray-600 dark:text-slate-300">
            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
            <span>
              Your account authentication is secured via JWT session tokens.
            </span>
          </div>
        </div>

        {/* Section 3: Architecture Generation Preferences */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40 flex items-center justify-center shrink-0">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Application Preferences
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Default technical constraints for new architecture requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">
                Default Cloud Infrastructure
              </label>
              <select
                value={defaultCloud}
                onChange={(e) => setDefaultCloud(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition"
              >
                <option value="No Preference">No Preference</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="Google Cloud">Google Cloud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">
                Default Database Preference
              </label>
              <select
                value={defaultDb}
                onChange={(e) => setDefaultDb(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition"
              >
                <option value="No Preference">No Preference</option>
                <option value="SQL">SQL (Relational)</option>
                <option value="NoSQL">NoSQL (Document/KeyValue)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
