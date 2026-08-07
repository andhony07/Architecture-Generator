import api from "../api/axios";

export const generateArchitecture = async (projectData) => {
  const response = await api.post("/projects/generate", projectData);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const addProjectMember = async (projectId, email) => {
  const response = await api.post(`/projects/${projectId}/members`, { email });
  return response.data;
};

export const removeProjectMember = async (projectId, memberId) => {
  const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
  return response.data;
};

/**
 * Download a project architecture export as a file.
 * Triggers an immediate browser download without navigating away.
 *
 * @param {string} projectId - MongoDB project ID
 * @param {"pdf"|"docx"|"json"|"markdown"} format - Export format
 * @returns {Promise<void>}
 */
export const exportProject = async (projectId, format) => {
  const response = await api.get(`/projects/${projectId}/export/${format}`, {
    responseType: "blob",
  });

  // Derive filename from Content-Disposition header, falling back to a generic name
  const disposition = response.headers["content-disposition"] || "";
  const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/);
  const filename = filenameMatch ? filenameMatch[1] : `architecture.${format}`;

  // Create a temporary object URL and trigger the download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Clean up
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};