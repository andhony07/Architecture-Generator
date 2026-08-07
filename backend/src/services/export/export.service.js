import Project from "../../models/Project.js";
import { generatePDF } from "../../utils/export/pdfGenerator.js";
import { generateDOCX } from "../../utils/export/docxGenerator.js";
import { generateMarkdown } from "../../utils/export/markdownGenerator.js";
import { generateJSON } from "../../utils/export/jsonExporter.js";
import { sanitizeFilename } from "../../utils/export/filenameSanitizer.js";

/**
 * Verify user has access to the project (owner or member).
 * Returns the project document if authorized, throws otherwise.
 *
 * @param {string} projectId
 * @param {string} userId
 * @returns {Promise<object>} project plain object
 */
const authorizeAndFetch = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ user: userId }, { "members.user": userId }],
  })
    .populate("user", "name email")
    .populate("members.user", "name email")
    .lean();

  if (!project) {
    const error = new Error("Project not found or access denied");
    error.statusCode = 403;
    throw error;
  }

  if (!project.architecture) {
    const error = new Error("This project has no architecture data to export");
    error.statusCode = 400;
    throw error;
  }

  return project;
};

// ── Export Service Methods ────────────────────────────────────────────────────

export const exportProjectPDF = async (projectId, userId) => {
  const project = await authorizeAndFetch(projectId, userId);
  const buffer = await generatePDF(project);
  const filename = `${sanitizeFilename(project.title)}.pdf`;
  return { buffer, filename, mimeType: "application/pdf" };
};

export const exportProjectDOCX = async (projectId, userId) => {
  const project = await authorizeAndFetch(projectId, userId);
  const buffer = await generateDOCX(project);
  const filename = `${sanitizeFilename(project.title)}.docx`;
  return {
    buffer,
    filename,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
};

export const exportProjectJSON = async (projectId, userId) => {
  const project = await authorizeAndFetch(projectId, userId);
  const content = generateJSON(project);
  const filename = `${sanitizeFilename(project.title)}.json`;
  return { content, filename, mimeType: "application/json" };
};

export const exportProjectMarkdown = async (projectId, userId) => {
  const project = await authorizeAndFetch(projectId, userId);
  const content = generateMarkdown(project);
  const filename = `${sanitizeFilename(project.title)}.md`;
  return { content, filename, mimeType: "text/markdown; charset=utf-8" };
};
