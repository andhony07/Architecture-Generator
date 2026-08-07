import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Sparkles,
  Plus,
  ArrowRight,
  Cpu,
  Boxes,
  Database,
  Cloud,
  Server
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/project.service";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardProjects() {
      try {
        const response = await getProjects();
        if (!isMounted) return;
        const projectList = Array.isArray(response)
          ? response
          : response.data || [];
        setProjects(projectList);
      } catch (error) {
        if (!isMounted) return;
        console.error("Dashboard project loading error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalProjects = projects.length;
  const generatedArchitectures = projects.filter((p) => p.status === "Generated" || p.architecture).length;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* 1. Bright Colorful Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-100 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              <span>AI Architecture Platform</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Architect"}
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Build production-ready, scalable software architectures with AI-driven technology blueprints and component topologies.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                to="/dashboard/new"
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create Architecture</span>
              </Link>
              <a
                href="#recent-projects"
                className="px-5 py-2.5 rounded-xl bg-indigo-800/40 hover:bg-indigo-800/60 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
              >
                <span>View Projects</span>
              </a>
            </div>
          </div>

          {/* Original Lightweight CSS Architecture Node Illustration */}
          <div className="relative w-full max-w-xs h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 flex flex-col justify-between shrink-0 font-mono text-[10px]">
            <div className="flex justify-between items-center">
              <div className="px-2 py-1 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                <Boxes size={10} /> Web Client
              </div>
              <div className="text-white/40">→</div>
              <div className="px-2 py-1 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1">
                <Server size={10} /> API Gateway
              </div>
            </div>

            <div className="flex justify-center text-white/40">↓</div>

            <div className="flex justify-between items-center">
              <div className="px-2 py-1 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <Database size={10} /> DB Cluster
              </div>
              <div className="px-2 py-1 rounded bg-amber-500/30 text-amber-200 border border-amber-400/30 flex items-center gap-1">
                <Cloud size={10} /> Cloud Stack
              </div>
            </div>
          </div>
        </div>

        {/* 2. Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Projects"
            value={totalProjects}
            description="Projects created"
            icon={FolderKanban}
            color="indigo"
          />
          <StatCard
            title="Architectures Generated"
            value={generatedArchitectures}
            description="AI system designs"
            icon={Cpu}
            color="blue"
          />
          <StatCard
            title="AI Engine"
            value="Gemini"
            description="Ready & Active"
            icon={Sparkles}
            color="purple"
          />
        </div>

        {/* 3. Recent Projects Section */}
        <div id="recent-projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Recent System Architectures
            </h2>
            {projects.length > 0 && (
              <Link
                to="/dashboard/projects"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center text-xs text-gray-400 font-mono">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
              Loading architectures...
            </div>
          ) : projects.length === 0 ? (
            /* Polished Light Empty State */
            <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center mx-auto">
                <Boxes size={28} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  No architectures yet
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                  Describe your software idea and let AI Architect design a scalable system topology.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/dashboard/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/10 transition"
                >
                  <Plus size={16} />
                  <span>Create Architecture</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;