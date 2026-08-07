import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = forwardRef(
  (
    {
      label,
      error,
      className = "",
      containerClassName = "",
      autoComplete = "current-password",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center justify-center">
            <Lock size={18} />
          </div>
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            autoComplete={autoComplete}
            className={`w-full bg-[#111318] border ${
              error ? "border-red-500/80 focus:ring-red-500/30" : "border-[#252A34] focus:border-indigo-500 focus:ring-indigo-500/20"
            } rounded-lg pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:ring-2 transition duration-200 ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 hover:text-gray-200 transition focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-400 font-medium flex items-center gap-1 mt-1">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
