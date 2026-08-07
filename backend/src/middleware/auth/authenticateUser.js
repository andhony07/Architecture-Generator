import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import STATUS_CODES from "../../constants/http/statusCodes.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
        errors: [],
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
        errors: [],
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token",
      errors: [],
    });
  }
};

export default authenticateUser;