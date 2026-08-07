import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center p-6 transition-colors duration-200">
      <div className="text-center max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <Compass size={32} />
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 mt-1">
            Page Not Found
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
            The architecture node or route you are trying to access does not exist or has been moved.
          </p>
        </div>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/10"
          >
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;