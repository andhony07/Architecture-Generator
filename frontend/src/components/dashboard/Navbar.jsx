import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Plus,
  Menu,
  Sparkles,
  User,
  Settings as SettingsIcon,
  LogOut,
  Check,
  CheckCheck
} from "lucide-react";

import ThemeSwitcher from "../theme/ThemeSwitcher";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from "../../services/notification.service";

const Navbar = ({ onMobileToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch real user notifications
  useEffect(() => {
    let isMounted = true;

    async function loadNotifs() {
      try {
        const res = await getNotifications();
        if (!isMounted) return;
        if (res && res.data) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading notifications:", err);
      }
    }

    loadNotifs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (item) => {
    setNotifOpen(false);
    if (item.project) {
      navigate(`/dashboard/projects/${item.project}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
      {/* Left: Mobile Sidebar Trigger & Title Context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileToggle}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-extrabold text-gray-900 dark:text-white tracking-tight">
            System Design Studio
          </span>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            Enterprise MERN
          </span>
        </div>
      </div>

      {/* Right: Actions (Theme, Notifications, Global CTA, Avatar Dropdown) */}
      <div className="flex items-center gap-3">
        {/* Theme Selector Component */}
        <ThemeSwitcher />

        {/* Persistent Notifications Bell Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in space-y-1">
              <div className="p-3.5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 flex items-center justify-center mx-auto">
                      <Bell size={20} />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      No notifications yet
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      Project and collaboration updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 text-xs transition cursor-pointer flex items-start gap-3 ${
                        n.read
                          ? "bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                          : "bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={16} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate">
                            {n.title}
                          </h4>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkRead(n._id, e)}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5"
                            >
                              <Check size={12} />
                              <span>Read</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-slate-300 leading-snug">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-gray-400 block font-medium">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Primary CTA: + New Architecture */}
        <Link
          to="/dashboard/new"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
        >
          <Plus size={16} />
          <span>New Architecture</span>
        </Link>

        {/* Top Right Avatar Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-500/10 hover:opacity-90 transition shrink-0"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 animate-fade-in space-y-1">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {user?.name || "Architect"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                  {user?.email || "user@architect.ai"}
                </p>
              </div>

              <Link
                to="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                <User size={15} className="text-indigo-500" />
                <span>Profile</span>
              </Link>

              <Link
                to="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                <SettingsIcon size={15} className="text-purple-500" />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;