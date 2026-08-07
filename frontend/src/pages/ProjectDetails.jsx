import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Sparkles,
  Database,
  Cloud,
  ShieldCheck,
  Server,
  Code2,
  RefreshCw,
  Clock,
  Boxes,
  Network,
  Bot,
  Users,
  UserPlus,
  Trash2,
  X,
  Crown,
  Download,
  ChevronDown,
  FileText,
  FileJson,
  FileCode,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import {
  getProjectById,
  generateArchitecture,
  addProjectMember,
  removeProjectMember,
  exportProject,
} from "../services/project.service";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("components");

  // Export dropdown state
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null);
  const exportMenuRef = useRef(null);

  // Team Collaboration Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProjectDetails() {
      try {
        const response = await getProjectById(id);
        if (!isMounted) return;
        if (response && response.data) {
          setProject(response.data);
        } else {
          setProject(response);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching project details:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load architecture details or access denied."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProjectDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleExport = async (format) => {
    if (exportingFormat) return; // prevent double click
    setExportMenuOpen(false);
    setExportingFormat(format);

    const formatLabels = {
      pdf: "PDF Report",
      docx: "DOCX Report",
      json: "JSON",
      markdown: "Markdown",
    };

    const toastId = toast.loading(`Generating ${formatLabels[format]}...`);

    try {
      await exportProject(project._id || project.id, format);
      toast.success(`${formatLabels[format]} downloaded successfully!`, { id: toastId });
    } catch (err) {
      console.error(`Export (${format}) error:`, err);
      const message =
        err.response?.data?.message ||
        err.message ||
        `Failed to generate ${formatLabels[format]}. Please try again.`;
      toast.error(message, { id: toastId });
    } finally {
      setExportingFormat(null);
    }
  };

  const handleRegenerate = async () => {
    if (!project) return;
    setRegenerating(true);
    try {
      const response = await generateArchitecture({
        title: project.title,
        description: project.description,
        projectType: project.projectType,
        expectedScale: project.expectedScale,
        preferredCloud: project.preferredCloud,
        preferredDatabase: project.preferredDatabase,
        constraints: project.constraints,
      });
      toast.success("Architecture blueprint regenerated!");
      const newProj = response.data || response;
      if (newProj && (newProj._id || newProj.id)) {
        navigate(`/dashboard/projects/${newProj._id || newProj.id}`);
      } else {
        setProject(newProj);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to regenerate architecture.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    const email = memberEmail ? memberEmail.trim() : "";
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setAddingMember(true);
    try {
      const response = await addProjectMember(project._id || project.id, email);
      toast.success("Team member added successfully!");
      setAddModalOpen(false);
      setMemberEmail("");
      const updatedData = response.data || response;
      setProject((prev) => ({
        ...prev,
        members: updatedData.members || prev.members,
      }));
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to add member. Check if they have an active account.";
      toast.error(message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberUserId, memberName) => {
    if (!window.confirm(`Remove ${memberName || "this member"} from team members?`)) {
      return;
    }

    try {
      const response = await removeProjectMember(
        project._id || project.id,
        memberUserId
      );
      toast.success("Team member removed.");
      const updatedData = response.data || response;
      setProject((prev) => ({
        ...prev,
        members: updatedData.members || [],
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove member.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 dark:text-slate-400 font-sans">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-semibold">Loading Architecture Blueprint...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/40 rounded-3xl p-8 max-w-xl mx-auto my-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto font-bold text-lg">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Not Found</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {error || "The requested project architecture specification could not be located."}
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              <ArrowLeft size={16} /> Back to Projects
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const arch = project.architecture || {};
  const components = arch.components || [];
  const dataFlow = arch.dataFlow || [];
  const aiMeta = project.aiMetadata || arch.aiMetadata || {};
  const aiProviderName =
    aiMeta.provider === "nvidia"
      ? `Generated with NVIDIA Nemotron (${aiMeta.model || "Nemotron"})`
      : `Generated with Gemini (${aiMeta.model || "Gemini"})`;

  const isOwner = project.isOwner !== false;
  const canManage = project.canManage !== false && isOwner;
  const ownerUser = project.user || {};
  const membersList = project.members || [];

  const componentMap = new Map(components.map((c) => [c.id || c.name, c.name || c.id]));

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
        {/* Top Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-slate-800">
          <div>
            <Link
              to="/dashboard/projects"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 hover:text-indigo-600 font-semibold mb-2 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Projects</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {project.title}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                {project.status || "Generated"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                <Bot size={13} />
                <span>{aiProviderName}</span>
              </span>
              {!isOwner && (
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40">
                  Shared (Viewer Access)
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1.5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock size={13} /> Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>Type: {project.projectType || "Web Application"}</span>
              <span>•</span>
              <span>Scale: {project.expectedScale || "Standard"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
              <span>{regenerating ? "Regenerating..." : "Regenerate"}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenuOpen((prev) => !prev)}
                disabled={!!exportingFormat}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold transition flex items-center gap-2 shadow-sm"
              >
                {exportingFormat ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                <span>
                  {exportingFormat
                    ? `Generating ${exportingFormat.toUpperCase()}...`
                    : "Export"}
                </span>
                {!exportingFormat && (
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      exportMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {exportMenuOpen && !exportingFormat && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                      Export Format
                    </p>
                  </div>

                  {[
                    { format: "pdf", label: "PDF Report", icon: FileText, color: "text-rose-500" },
                    { format: "docx", label: "DOCX Report", icon: FileCode, color: "text-blue-500" },
                    { format: "json", label: "JSON", icon: FileJson, color: "text-amber-500" },
                    { format: "markdown", label: "Markdown", icon: FileCode, color: "text-emerald-500" },
                  ].map(({ format, label, icon: Icon, color }) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition text-left"
                    >
                      <Icon size={15} className={color} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Executive Summary & Architecture Pattern */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles size={16} /> Executive Architecture Overview
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              Pattern: {arch.architecture?.pattern || "Client-Server Microservices"}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">
            {arch.summary || project.description}
          </p>
        </div>

        {/* Team Collaboration Section */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
              <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span>Team Members & Access</span>
            </div>

            {canManage && (
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus size={14} />
                <span>Add Member</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {/* Owner Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {ownerUser.name ? ownerUser.name.charAt(0).toUpperCase() : "O"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {ownerUser.name || "Project Owner"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                    {ownerUser.email || "Creator"}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-200 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 flex items-center gap-1 shrink-0">
                <Crown size={10} /> Owner
              </span>
            </div>

            {/* Additional Members */}
            {membersList.map((m) => {
              const memUser = m.user || {};
              const memUserId = memUser._id || memUser.id || m._id;

              return (
                <div
                  key={memUserId}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-700/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {memUser.name ? memUser.name.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {memUser.name || "Team Member"}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                        {memUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                      Viewer
                    </span>
                    {canManage && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(memUserId, memUser.name)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Remove Member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabbed Specs Section */}
        <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex gap-2 border-b border-gray-100 dark:border-slate-700/80 pb-3 overflow-x-auto">
            {[
              { id: "components", label: "System Components", icon: Boxes },
              { id: "dataflow", label: "Data Flow Steps", icon: Network },
              { id: "frontend", label: "Frontend Spec", icon: Code2 },
              { id: "backend", label: "Backend & API", icon: Server },
              { id: "database", label: "Database Spec", icon: Database },
              { id: "devops", label: "Cloud & DevOps", icon: Cloud },
              { id: "security", label: "Security & Scale", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Components Tab */}
          {activeTab === "components" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                System components topology (prepared with IDs & technologies for visual diagram generation):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {components.map((comp, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">{comp.name}</h5>
                        {comp.id && (
                          <span className="text-[10px] text-gray-400 font-mono">({comp.id})</span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40 uppercase shrink-0">
                        {comp.type || "service"}
                      </span>
                    </div>

                    {comp.technology && (
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold border border-gray-200 dark:border-slate-700">
                        Tech: {comp.technology}
                      </div>
                    )}

                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Flow Tab */}
          {activeTab === "dataflow" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                Inter-component interaction data flows:
              </p>
              <div className="space-y-3">
                {dataFlow.map((flow, idx) => {
                  const sourceName = componentMap.get(flow.source || flow.from) || flow.source || flow.from;
                  const targetName = componentMap.get(flow.target || flow.to) || flow.target || flow.to;

                  return (
                    <div key={idx} className="bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-slate-700">
                          {sourceName}
                        </span>
                        <span className="text-indigo-600 font-bold">→</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-gray-200 dark:border-slate-700">
                          {targetName}
                        </span>
                        {flow.label && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold border border-indigo-100 dark:border-indigo-900/40">
                            {flow.label}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-600 dark:text-slate-400">{flow.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Specs */}
          {activeTab === "frontend" && (
            <div className="space-y-3 text-xs text-gray-700 dark:text-slate-300">
              <h5 className="text-cyan-600 font-bold uppercase">Frontend Architecture Specification</h5>
              <p className="text-gray-600 dark:text-slate-400">{arch.frontend?.reasoning}</p>
            </div>
          )}
          {activeTab === "backend" && (
            <div className="space-y-3 text-xs text-gray-700 dark:text-slate-300">
              <h5 className="text-indigo-600 font-bold uppercase">Backend API Specification</h5>
              <p className="text-gray-600 dark:text-slate-400">{arch.backend?.reasoning}</p>
            </div>
          )}
          {activeTab === "database" && (
            <div className="space-y-3 text-xs text-gray-700 dark:text-slate-300">
              <h5 className="text-emerald-600 font-bold uppercase">Database Engine & Caching</h5>
              <p className="text-gray-600 dark:text-slate-400">{arch.database?.reasoning}</p>
            </div>
          )}
          {activeTab === "devops" && (
            <div className="space-y-3 text-xs text-gray-700 dark:text-slate-300">
              <h5 className="text-orange-600 font-bold uppercase">Cloud & DevOps Pipelines</h5>
              <p className="text-gray-600 dark:text-slate-400">{arch.cloud?.provider}</p>
            </div>
          )}
          {activeTab === "security" && (
            <div className="space-y-3 text-xs text-gray-700 dark:text-slate-300">
              <h5 className="text-rose-600 font-bold uppercase">Security & Scalability</h5>
              <p className="text-gray-600 dark:text-slate-400">{arch.security?.join(", ")}</p>
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
                  <UserPlus size={18} className="text-indigo-600" />
                  <span>Add Team Member</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Registered User Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@domain.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    disabled={addingMember}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Note: User must already be registered in AI Architect.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingMember}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {addingMember ? "Adding..." : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
