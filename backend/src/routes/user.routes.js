import { Router } from "express";
import authenticateUser from "../middleware/auth/authenticateUser.js";
import { getProfile } from "../controllers/user/user.controller.js";

const router = Router();

router.use(authenticateUser);

router.get("/me", getProfile);

export default router;
