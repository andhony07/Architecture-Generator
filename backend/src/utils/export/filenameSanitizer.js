/**
 * Sanitize a project title into a safe filesystem filename.
 * Replaces spaces and invalid characters with underscores.
 *
 * @param {string} title - Raw project title
 * @returns {string} Safe filename base (no extension)
 */
export const sanitizeFilename = (title = "Architecture") => {
  return String(title)
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "") // remove illegal filesystem chars
    .replace(/\s+/g, "_")                    // replace whitespace with underscore
    .replace(/_{2,}/g, "_")                  // collapse consecutive underscores
    .replace(/^_+|_+$/g, "")                 // trim leading/trailing underscores
    .substring(0, 200)                        // cap length for OS safety
    || "Architecture";
};
