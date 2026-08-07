import STATUS_CODES from "../../constants/http/statusCodes.js";
import Project from "../../models/Project.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Real database counts
    const ownedProjectsCount = await Project.countDocuments({ user: userId });
    const sharedProjectsCount = await Project.countDocuments({
      "members.user": userId,
    });
    const totalArchitecturesCount = ownedProjectsCount;

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
        stats: {
          projectsCreated: ownedProjectsCount,
          architecturesGenerated: totalArchitecturesCount,
          sharedProjects: sharedProjectsCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
