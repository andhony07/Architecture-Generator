import Project from "../../models/Project.js";
import User from "../../models/User.js";
import { generateArchitecture } from "../../ai/ai.service.js";
import { createNotification } from "../notification/notification.service.js";

export const createProject = async (projectData, userId) => {
  const title = projectData.title || projectData.projectName || "Untitled Architecture";
  const description = projectData.description || "";

  const aiResult = await generateArchitecture({
    ...projectData,
    title,
    description,
  });

  const aiMetadata = aiResult.aiMetadata || {
    provider: "gemini",
    model: "gemini-2.5-flash",
  };

  const project = await Project.create({
    title,
    description,
    projectType: projectData.projectType || "Web Application",
    expectedScale: projectData.expectedScale || "Standard",
    preferredCloud: projectData.preferredCloud || "No Preference",
    preferredDatabase: projectData.preferredDatabase || "No Preference",
    constraints: projectData.constraints || "",
    status: "Generated",
    architecture: aiResult,
    aiMetadata,
    user: userId,
    members: [],
  });

  // Create notification for creator
  try {
    await createNotification({
      user: userId,
      type: "ARCHITECTURE_GENERATED",
      title: "Architecture Generated",
      message: `Blueprint for "${title}" was generated successfully.`,
      project: project._id,
    });
  } catch (err) {
    console.error("Failed to create generation notification:", err);
  }

  return project;
};

export const getProjects = async (userId) => {
  return await Project.find({
    $or: [{ user: userId }, { "members.user": userId }],
  })
    .populate("user", "name email")
    .populate("members.user", "name email")
    .sort({ createdAt: -1 });
};

export const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ user: userId }, { "members.user": userId }],
  })
    .populate("user", "name email")
    .populate("members.user", "name email");

  if (!project) return null;

  const isOwner = project.user._id.toString() === userId.toString();

  return {
    ...project.toObject(),
    isOwner,
    canManage: isOwner,
  };
};

export const addProjectMember = async (projectId, ownerId, memberEmail) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  if (project.user.toString() !== ownerId.toString()) {
    const error = new Error("Only the project owner can manage team members.");
    error.statusCode = 403;
    throw error;
  }

  const normalizedEmail = memberEmail ? memberEmail.trim().toLowerCase() : "";
  const targetUser = await User.findOne({ email: normalizedEmail });

  if (!targetUser) {
    const error = new Error("User not found. They need an account before being added.");
    error.statusCode = 404;
    throw error;
  }

  if (targetUser._id.toString() === ownerId.toString()) {
    const error = new Error("Project owner is already the project creator.");
    error.statusCode = 400;
    throw error;
  }

  const isAlreadyMember = project.members.some(
    (m) => m.user.toString() === targetUser._id.toString()
  );

  if (isAlreadyMember) {
    const error = new Error("User is already a team member of this project.");
    error.statusCode = 400;
    throw error;
  }

  project.members.push({
    user: targetUser._id,
    role: "viewer",
    addedAt: new Date(),
  });

  await project.save();

  // Create notification for added user
  try {
    await createNotification({
      user: targetUser._id,
      type: "TEAM_MEMBER_ADDED",
      title: "Added to Project Team",
      message: `You were added as a team member to "${project.title}".`,
      project: project._id,
    });
  } catch (err) {
    console.error("Failed to create member added notification:", err);
  }

  const updated = await Project.findById(projectId)
    .populate("user", "name email")
    .populate("members.user", "name email");

  return updated;
};

export const removeProjectMember = async (projectId, ownerId, memberId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  if (project.user.toString() !== ownerId.toString()) {
    const error = new Error("Only the project owner can manage team members.");
    error.statusCode = 403;
    throw error;
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== memberId.toString()
  );

  await project.save();

  // Create notification for removed user
  try {
    await createNotification({
      user: memberId,
      type: "TEAM_MEMBER_REMOVED",
      title: "Removed from Project Team",
      message: `You were removed from team members of "${project.title}".`,
      project: project._id,
    });
  } catch (err) {
    console.error("Failed to create member removed notification:", err);
  }

  const updated = await Project.findById(projectId)
    .populate("user", "name email")
    .populate("members.user", "name email");

  return updated;
};