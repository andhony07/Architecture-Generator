import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FolderKanban } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ProjectCard from "../components/dashboard/ProjectCard";
import { getProjects } from "../services/project.service";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [ownershipTab, setOwnershipTab] = useState("all"); // 'all' | 'mine' | 'shared'

  useEffect(() => {
    let isMounted = true;

    async function loadAllProjects() {
      try {
        const response = await getProjects();
        if (!isMounted) return;
        const projectList = Array.isArray(response)
          ? response
          : response.data || [];
        setProjects(projectList);
      } catch (error) {
        if (!isMounted) return;
        console.error("Projects page loading error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAllProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = projects.filter((p) => {
    const ownerId = typeof p.user === "object" ? p.user?._id : p.user;
    const isMine =
      p.isOwner !== undefined
        ? p.isOwner
        : !ownerId || (user?.id && ownerId === user.id);

    if (ownershipTab === "mine" && !isMine) return false;
    if (ownershipTab === "shared" && isMine) return false;

    const matchesSearch =
      (p.title || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.projectType || "").toLowerCase().includes(filterQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="pb-4 border-b border-gray-200/80 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Manage and explore all your generated system architectures.
          </p>
        </div>

        {/* Ownership Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Projects" },
              { id: "mine", label: "My Projects" },
              { id: "shared", label: "Shared With Me" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOwnershipTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  ownershipTab === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200/80 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search projects by title, type, or specs..."
                className="w-full bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition"
              />
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 shrink-0">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>
        </div>

        {/* Projects Grid / Contextual Empty State */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center text-xs text-gray-400 font-mono">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
            Loading project library...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center mx-auto">
              <FolderKanban size={26} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {filterQuery
                  ? "No matching projects found"
                  : ownershipTab === "shared"
                  ? "No shared projects yet"
                  : "No architectures yet"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {filterQuery
                  ? "Try adjusting your search terms."
                  : ownershipTab === "shared"
                  ? "Architectures shared with you by other team members will appear here."
                  : "Describe your first software idea and let AI design the system."}
              </p>
            </div>

            {ownershipTab !== "shared" && (
              <div className="pt-2">
                <Link
                  to="/dashboard/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
                >
                  <Plus size={16} />
                  <span>Create Architecture</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
