import DashboardLayout from "../layouts/DashboardLayout";
import ProjectForm from "../components/project/ProjectForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NewProject = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80 dark:border-slate-800">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create New Architecture
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs font-semibold">
            <Sparkles size={14} />
            <span>AI Architecture Generator</span>
          </div>
        </div>

        {/* Project Generation Form Component */}
        <ProjectForm />
      </div>
    </DashboardLayout>
  );
};

export default NewProject;