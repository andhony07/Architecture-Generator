import { validationResult } from "express-validator";
import STATUS_CODES from "../../constants/http/statusCodes.js";
import {
  createProject,
  getProjects,
  getProjectById,
  addProjectMember,
  removeProjectMember,
} from "../../services/project/project.service.js";

export const generateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: errors.array()[0]?.msg || "Validation failed",
        errors: errors.array(),
      });
    }

    const project = await createProject(req.body, req.user._id);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Architecture generated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Generate Project Controller Error:", error);
    next(error);
  }
};

export const fetchProjects = async (req, res, next) => {
  try {
    const projects = await getProjects(req.user._id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id, req.user._id);

    if (!project) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Architecture project not found or access denied",
      });
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Member email address is required",
      });
    }

    const updatedProject = await addProjectMember(id, req.user._id, email);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Team member added successfully",
      data: updatedProject,
    });
  } catch (error) {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to add team member",
    });
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const updatedProject = await removeProjectMember(id, req.user._id, memberId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Team member removed successfully",
      data: updatedProject,
    });
  } catch (error) {
    const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to remove team member",
    });
  }
};