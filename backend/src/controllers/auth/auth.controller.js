import { validationResult } from "express-validator";

import STATUS_CODES from "../../constants/http/statusCodes.js";

import {
  registerUser,
  loginUser,
} from "../../services/auth/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const user = await registerUser(req.body);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { token, user } = await loginUser(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      errors: [],
  });
}
};

export const profile = async (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    data: req.user,
  });
};