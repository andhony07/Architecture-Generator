import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  FolderKanban,
  Sparkles,
  Users,
  Plus
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/user.service";
import { getProjects } from "../services/project.service";
import ProjectCard from "../components/dashboard/ProjectCard";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfileAndProjects() {
      try {
        const [profRes, projRes] = await Promise.all([
          getUserProfile(),
          getProjects(),
        ]);

        if (!isMounted) return;

        if (profRes && profRes.data) {
          setProfileData(profRes.data);
        } else {
          setProfileData(profRes);
        }

        const projectList = Array.isArray(projRes) ? projRes : projRes.data || [];
        setUserProjects(projectList);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading user profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfileAndProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = profileData?.stats || {
    projectsCreated: userProjects.length,
    architecturesGenerated: userProjects.length,
    sharedProjects: userProjects.filter((p) => p.isOwner === false).length,
  };

  const name = profileData?.name || authUser?.name || "Architect";
  const email = profileData?.email || authUser?.email || "architect@domain.com";
  const createdAt = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently Joined";

  const ownedProjects = userProjects.filter(
    (p) => !p.user || p.isOwner !== false || (p.user._id && p.user._id === authUser?.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        {/* Page Header Card */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
                {name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-indigo-500" />
                  <span>{email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-purple-500" />
                  <span>Member since {createdAt}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Database Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Stat 1: Projects Created */}
          <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderKanban size={18} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {loading ? "..." : stats.projectsCreated}
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Projects Created
            </p>
          </div>

          {/* Stat 2: Architectures Generated */}
          <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {loading ? "..." : stats.architecturesGenerated}
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Architectures Generated
            </p>
          </div>

          {/* Stat 3: Shared Projects */}
          <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {loading ? "..." : stats.sharedProjects}
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Shared Projects
            </p>
          </div>
        </div>

        {/* Owned Projects Library */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
              Your Projects
            </h2>
            <Link
              to="/dashboard/new"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>Create Architecture</span>
            </Link>
          </div>

          {loading ? (
            <div className="min-h-[160px] flex items-center justify-center text-xs text-gray-400 font-mono">
              Loading your architecture specifications...
            </div>
          ) : ownedProjects.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-8 text-center space-y-3">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                No projects created yet. Describe your first system architecture.
              </p>
              <Link
                to="/dashboard/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                <Plus size={14} />
                <span>Create Architecture</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ownedProjects.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
