import express from "express";
import {
  signup,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
