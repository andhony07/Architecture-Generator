import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Boxes,
  Settings,
  LogOut,
  ChevronDown,
  User
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "New Architecture",
      path: "/dashboard/new",
      icon: PlusCircle,
    },
    {
      label: "Projects",
      path: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      label: "Templates",
      path: "/dashboard/templates",
      icon: Boxes,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 transition-colors duration-200 shrink-0 z-30">
      <div>
        {/* Logo Section */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/10 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="5" r="2.5" fill="#4F46E5" />
                <circle cx="5" cy="18" r="2.5" fill="#0891B2" />
                <circle cx="19" cy="18" r="2.5" fill="#7C3AED" />
                <path d="M12 7.5V13M12 13L6.5 16M12 13L17.5 16" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <div className="font-extrabold text-sm text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>AI Architect</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-400 font-medium">
              System Design Studio
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path + "/"));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/40"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-400"}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & User Profile */}
      <div className="p-4 space-y-2 border-t border-gray-100 dark:border-slate-800">
        <Link
          to="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
            location.pathname === "/dashboard/settings"
              ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/40"
              : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
        >
          <Settings size={18} className={location.pathname === "/dashboard/settings" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-400"} />
          <span>Settings</span>
        </Link>

        {/* User Profile Card */}
        <div className="relative pt-2">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700/80 hover:bg-gray-100 dark:hover:bg-slate-800 transition text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {user?.name || "Architect"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                  {user?.email || "user@architect.ai"}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400 shrink-0" />
          </button>

          {profileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-50 animate-fade-in space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                Signed in as {user?.name || "User"}
              </div>

              <Link
                to="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 rounded-lg transition"
              >
                <User size={14} className="text-indigo-500" />
                <span>View Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;