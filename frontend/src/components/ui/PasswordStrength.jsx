const PasswordStrength = ({ password = "" }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let label = "Weak";
  let colorClass = "bg-red-500";
  let textColor = "text-red-400";

  if (score === 2 || score === 3) {
    label = "Medium";
    colorClass = "bg-amber-500";
    textColor = "text-amber-400";
  } else if (score >= 4) {
    label = "Strong";
    colorClass = "bg-emerald-500";
    textColor = "text-emerald-400";
  }

  return (
    <div className="mt-2 space-y-1.5 animate-fade-in">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Password strength:</span>
        <span className={`font-semibold ${textColor}`}>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        <div className={`rounded-full transition-all duration-300 ${score >= 1 ? colorClass : "bg-[#252A34]"}`} />
        <div className={`rounded-full transition-all duration-300 ${score >= 2 ? colorClass : "bg-[#252A34]"}`} />
        <div className={`rounded-full transition-all duration-300 ${score >= 3 ? colorClass : "bg-[#252A34]"}`} />
        <div className={`rounded-full transition-all duration-300 ${score >= 4 ? colorClass : "bg-[#252A34]"}`} />
      </div>
      <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-0.5">
        <span className={password.length >= 6 ? "text-emerald-400 font-medium" : ""}>
          ✓ 6+ characters
        </span>
        <span className={/[0-9]/.test(password) ? "text-emerald-400 font-medium" : ""}>
          ✓ Number
        </span>
        <span className={/[A-Z]/.test(password) ? "text-emerald-400 font-medium" : ""}>
          ✓ Uppercase
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;
