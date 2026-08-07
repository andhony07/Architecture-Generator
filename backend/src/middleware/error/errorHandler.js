import STATUS_CODES from "../../constants/http/statusCodes.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

export default errorHandler;