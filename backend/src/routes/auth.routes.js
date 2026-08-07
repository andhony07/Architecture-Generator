import { Router } from "express";

import {
  register,
  login,
  profile,
} from "../controllers/auth/auth.controller.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth/auth.validator.js";

import authenticateUser from "../middleware/auth/authenticateUser.js";

const router = Router();

// Register
router.post("/register", registerValidator, register);

// Login
router.post("/login", loginValidator, login);

// Profile
router.get("/profile", authenticateUser, profile);

export default router;