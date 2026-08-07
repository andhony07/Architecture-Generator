import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = "text",
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center justify-center">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full bg-[#111318] border ${
              error ? "border-red-500/80 focus:ring-red-500/30" : "border-[#252A34] focus:border-indigo-500 focus:ring-indigo-500/20"
            } rounded-lg px-3.5 py-2.5 ${
              Icon ? "pl-10" : ""
            } text-sm text-gray-100 placeholder-gray-500 outline-none focus:ring-2 transition duration-200 ${className}`}
            {...props}
          />
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

Input.displayName = "Input";

export default Input;
