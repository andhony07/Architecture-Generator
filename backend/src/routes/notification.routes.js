import { Router } from "express";
import authenticateUser from "../middleware/auth/authenticateUser.js";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification/notification.controller.js";

const router = Router();

router.use(authenticateUser);

router.get("/", fetchNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;
