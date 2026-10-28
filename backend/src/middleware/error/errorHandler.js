import STATUS_CODES from "../../constants/http/statusCodes.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: "Email already exists",
      errors: [],
    });
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: err.message || "Validation failed",
      errors: Object.values(err.errors || {}).map((e) => ({ msg: e.message })),
    });
  }

  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message =
    statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
      ? "Internal Server Error"
      : err.message || "An error occurred";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

export default errorHandler;
