import STATUS_CODES from "../constants/http/statusCodes.js";

export const healthCheck = (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    status: "OK",
    message: "Server is running",
  });
};