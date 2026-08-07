import express from "express";

import authenticateUser from "../middleware/auth/authenticateUser.js";
import { generateProjectValidator } from "../validators/project/project.validator.js";

import {
  generateProject,
  fetchProjects,
  fetchProjectById,
  addMember,
  removeMember,
} from "../controllers/project/project.controller.js";

import {
  exportPDF,
  exportDOCX,
  exportJSON,
  exportMarkdown,
} from "../controllers/export/export.controller.js";

const router = express.Router();

// Generate new architecture
router.post(
  "/generate",
  authenticateUser,
  generateProjectValidator,
  generateProject
);

// Fetch user projects list
router.get(
  "/",
  authenticateUser,
  fetchProjects
);

// ── Export Routes ─────────────────────────────────────────────────────────────
// Must be defined BEFORE /:id to avoid route conflicts

// GET /api/v1/projects/:id/export/pdf
router.get("/:id/export/pdf", authenticateUser, exportPDF);

// GET /api/v1/projects/:id/export/docx
router.get("/:id/export/docx", authenticateUser, exportDOCX);

// GET /api/v1/projects/:id/export/json
router.get("/:id/export/json", authenticateUser, exportJSON);

// GET /api/v1/projects/:id/export/markdown
router.get("/:id/export/markdown", authenticateUser, exportMarkdown);

// ─────────────────────────────────────────────────────────────────────────────

// Fetch single project architecture details by ID
router.get(
  "/:id",
  authenticateUser,
  fetchProjectById
);

// Team member management
router.post(
  "/:id/members",
  authenticateUser,
  addMember
);

router.delete(
  "/:id/members/:memberId",
  authenticateUser,
  removeMember
);

export default router;