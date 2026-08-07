import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  Wand2,
  Cpu,
  Cloud,
  Database,
  ArrowRight,
  Globe,
  Smartphone,
  Server,
  ShoppingCart,
  Boxes,
  X,
  BookmarkCheck
} from "lucide-react";

import { generateArchitecture } from "../../services/project.service";

const UX_MESSAGES = [
  "Analyzing requirements...",
  "Identifying system components...",
  "Evaluating scalability...",
  "Designing architecture...",
  "Preparing recommendations..."
];

const PROJECT_TYPES = [
  { id: "Web Application", label: "Web App", icon: Globe },
  { id: "Mobile Application", label: "Mobile App", icon: Smartphone },
  { id: "SaaS Platform", label: "SaaS Platform", icon: Boxes },
  { id: "E-commerce", label: "E-commerce", icon: ShoppingCart },
  { id: "API / Backend", label: "API / Backend", icon: Server },
  { id: "Other", label: "Other", icon: Cpu },
];

const ProjectForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const templateState = location.state?.template;
  const templateName = location.state?.templateName;

  const defaultValues = useMemo(() => ({
    title: templateState?.title || "",
    description: templateState?.description || "",
    projectType: templateState?.projectType || "Web Application",
    expectedScale: templateState?.expectedScale || "100,000 active users",
    preferredCloud: templateState?.preferredCloud || "No Preference",
    preferredDatabase: templateState?.preferredDatabase || "No Preference",
    constraints: templateState?.constraints || "",
  }), [templateState]);

  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedProjectType, setSelectedProjectType] = useState(
    defaultValues.projectType
  );
  const [activeTemplate, setActiveTemplate] = useState(templateName || null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < UX_MESSAGES.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSelectType = (typeId) => {
    setSelectedProjectType(typeId);
    setValue("projectType", typeId);
  };

  const handleClearTemplate = () => {
    setActiveTemplate(null);
    reset({
      title: "",
      description: "",
      projectType: "Web Application",
      expectedScale: "100,000 active users",
      preferredCloud: "No Preference",
      preferredDatabase: "No Preference",
      constraints: "",
    });
    setSelectedProjectType("Web Application");
    toast.success("Template cleared. Ready for custom requirements.");
  };

  const onSubmit = async (data) => {
    const trimmedTitle = data.title ? data.title.trim() : "";
    const trimmedDescription = data.description ? data.description.trim() : "";

    if (!trimmedTitle) {
      toast.error("Project name cannot be empty or whitespace only");
      return;
    }
    if (!trimmedDescription || trimmedDescription.length < 15) {
      toast.error("Project description must be at least 15 characters long");
      return;
    }

    setLoadingStep(0);
    try {
      const payload = {
        ...data,
        title: trimmedTitle,
        description: trimmedDescription,
        projectType: selectedProjectType,
      };

      const response = await generateArchitecture(payload);

      toast.success("Architecture blueprint generated successfully!");
      const createdProject = response.data || response;

      if (createdProject && (createdProject._id || createdProject.id)) {
        const id = createdProject._id || createdProject.id;
        navigate(`/dashboard/projects/${id}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message ||
        "Failed to generate architecture. Please check your backend connection and AI API key.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Active Template Indicator Banner */}
        {activeTemplate && (
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
            <div className="flex items-center gap-2">
              <BookmarkCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>
                Starting from template: <strong>{activeTemplate}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearTemplate}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold flex items-center gap-1 transition"
            >
              <span>Clear Template</span>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-slate-700/80">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
            <Wand2 size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              What are you building?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              Describe your software idea and let AI design a scalable system architecture.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Required: Project Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
              Project Name <span className="text-indigo-600 dark:text-indigo-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Scalable E-Commerce Platform"
              disabled={isSubmitting}
              className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition disabled:opacity-50"
              {...register("title", {
                required: "Project name is required",
                validate: (value) =>
                  (value && value.trim().length >= 3) ||
                  "Project name must be at least 3 characters and not empty whitespace",
              })}
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium mt-1.5">• {errors.title.message}</p>
            )}
          </div>

          {/* Visual Project Type Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
              Project Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROJECT_TYPES.map((pt) => {
                const Icon = pt.icon;
                const isSelected = selectedProjectType === pt.id;

                return (
                  <button
                    key={pt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectType(pt.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold transition ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "bg-gray-50 dark:bg-slate-900/40 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={18} className={isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"} />
                    <span>{pt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required: Requirements description prompt */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
              Project Description & Requirements <span className="text-indigo-600 dark:text-indigo-400">*</span>
            </label>
            <textarea
              rows={6}
              disabled={isSubmitting}
              placeholder="Build an e-commerce platform supporting 100,000 users with authentication, product management, online payments, order tracking, notifications, admin dashboard, analytics, and scalable cloud deployment."
              className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition leading-relaxed disabled:opacity-50"
              {...register("description", {
                required: "Project requirements description is required",
                validate: (value) =>
                  (value && value.trim().length >= 15) ||
                  "Please provide a detailed description (minimum 15 characters)",
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium mt-1.5">• {errors.description.message}</p>
            )}
          </div>

          {/* Additional Technical Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Cpu size={14} className="text-indigo-600 dark:text-indigo-400" /> Expected Users / Scale
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                placeholder="e.g. 100,000 users"
                className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition disabled:opacity-50"
                {...register("expectedScale")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Cloud size={14} className="text-indigo-600 dark:text-indigo-400" /> Preferred Cloud
              </label>
              <select
                disabled={isSubmitting}
                className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition disabled:opacity-50"
                {...register("preferredCloud")}
              >
                <option value="No Preference">No Preference</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="Google Cloud">Google Cloud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Database size={14} className="text-indigo-600 dark:text-indigo-400" /> Preferred Database
              </label>
              <select
                disabled={isSubmitting}
                className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition disabled:opacity-50"
                {...register("preferredDatabase")}
              >
                <option value="No Preference">No Preference</option>
                <option value="SQL">SQL</option>
                <option value="NoSQL">NoSQL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">
              Technical Constraints (Optional)
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              placeholder="e.g. Latency under 100ms, GDPR compliance, GraphQL API"
              className="w-full bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition disabled:opacity-50"
              {...register("constraints")}
            />
          </div>

          {/* Rotating Progress Feedback */}
          {isSubmitting && (
            <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>AI System Architecture Pipeline Active</span>
                </span>
                <span>Stage {loadingStep + 1} / {UX_MESSAGES.length}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {UX_MESSAGES[loadingStep]}
              </p>
              <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / UX_MESSAGES.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-100 dark:border-slate-700/80 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                reset({
                  title: "",
                  description: "",
                  projectType: "Web Application",
                  expectedScale: "100,000 active users",
                  preferredCloud: "No Preference",
                  preferredDatabase: "No Preference",
                  constraints: "",
                });
                setSelectedProjectType("Web Application");
                setActiveTemplate(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-semibold transition disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold text-sm flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Architecture</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;