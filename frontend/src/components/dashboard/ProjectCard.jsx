import { Link } from "react-router-dom";
import { ArrowRight, Clock, Layers, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProjectCard = ({ project }) => {
  const { user } = useAuth();
  const {
    _id,
    id,
    title,
    description,
    projectType = "Web Application",
    expectedScale = "Standard",
    status = "Generated",
    createdAt,
    architecture = {},
    user: projectOwner,
    isOwner: explicitOwnerFlag,
  } = project;

  const projectId = _id || id;
  const pattern = architecture?.architecture?.pattern || "Client-Server Microservices";

  const ownerId = typeof projectOwner === "object" ? projectOwner?._id : projectOwner;
  const isOwner =
    explicitOwnerFlag !== undefined
      ? explicitOwnerFlag
      : !ownerId || (user?.id && ownerId === user.id);

  return (
    <Link
      to={`/dashboard/projects/${projectId}`}
      className="group bg-white dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            <Layers size={12} />
            <span>{projectType}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {!isOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                <Users size={10} />
                <span>Shared</span>
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
              {status}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {title}
        </h4>

        {/* Description snippet */}
        <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Pattern & Scale info */}
        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 text-[11px] text-gray-600 dark:text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 dark:text-slate-300">Pattern:</span>
            <span className="truncate max-w-[140px] font-mono text-indigo-600 dark:text-indigo-400">{pattern}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 dark:text-slate-300">Scale:</span>
            <span>{expectedScale}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Clock size={13} />
          {new Date(createdAt).toLocaleDateString()}
        </span>

        <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
          View Blueprint <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;