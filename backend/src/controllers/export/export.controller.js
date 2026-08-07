import STATUS_CODES from "../../constants/http/statusCodes.js";
import {
  exportProjectPDF,
  exportProjectDOCX,
  exportProjectJSON,
  exportProjectMarkdown,
} from "../../services/export/export.service.js";

/**
 * Generic handler that sets download headers and pipes buffer/string to response.
 */
const sendFile = (res, { buffer, content, filename, mimeType }) => {
  const payload = buffer ?? Buffer.from(content, "utf-8");
  res.set({
    "Content-Type": mimeType,
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": payload.length,
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.end(payload);
};

/**
 * GET /api/v1/projects/:id/export/pdf
 */
export const exportPDF = async (req, res) => {
  try {
    const result = await exportProjectPDF(req.params.id, req.user._id);
    sendFile(res, result);
  } catch (error) {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || "PDF generation failed. Please try again.",
    });
  }
};

/**
 * GET /api/v1/projects/:id/export/docx
 */
export const exportDOCX = async (req, res) => {
  try {
    const result = await exportProjectDOCX(req.params.id, req.user._id);
    sendFile(res, result);
  } catch (error) {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || "DOCX generation failed. Please try again.",
    });
  }
};

/**
 * GET /api/v1/projects/:id/export/json
 */
export const exportJSON = async (req, res) => {
  try {
    const result = await exportProjectJSON(req.params.id, req.user._id);
    sendFile(res, result);
  } catch (error) {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || "JSON export failed. Please try again.",
    });
  }
};

/**
 * GET /api/v1/projects/:id/export/markdown
 */
export const exportMarkdown = async (req, res) => {
  try {
    const result = await exportProjectMarkdown(req.params.id, req.user._id);
    sendFile(res, result);
  } catch (error) {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Markdown export failed. Please try again.",
    });
  }
};
