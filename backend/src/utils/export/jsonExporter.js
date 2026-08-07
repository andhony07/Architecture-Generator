/**
 * JSON Exporter Utility
 * Returns the architecture object as a pretty-formatted JSON string buffer.
 *
 * @param {object} project - Mongoose project document (plain object)
 * @returns {string} JSON string (pretty-printed with 2-space indentation)
 */
export const generateJSON = (project) => {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    project: {
      id: project._id,
      title: project.title,
      description: project.description,
      projectType: project.projectType,
      expectedScale: project.expectedScale,
      preferredCloud: project.preferredCloud,
      preferredDatabase: project.preferredDatabase,
      constraints: project.constraints,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    },
    aiMetadata: project.aiMetadata || project.architecture?.aiMetadata || {},
    architecture: project.architecture || {},
  };

  return JSON.stringify(exportPayload, null, 2);
};
