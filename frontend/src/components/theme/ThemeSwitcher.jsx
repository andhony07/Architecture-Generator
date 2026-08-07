import { useState, useRef, useEffect } from "react";
import { Palette, Sun, Moon, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      id: "colorful",
      label: "Colorful",
      icon: Palette,
      desc: "Vibrant multi-color light theme",
    },
    {
      id: "light",
      label: "Light",
      icon: Sun,
      desc: "Clean white & slate theme",
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      desc: "Refined dark slate theme",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
      >
        <Palette size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50 animate-fade-in">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700 mb-1">
            Appearance
          </div>

          <div className="space-y-1">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"} />
                    <div className="text-left">
                      <div>{opt.label}</div>
                    </div>
                  </div>

                  {isActive && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
