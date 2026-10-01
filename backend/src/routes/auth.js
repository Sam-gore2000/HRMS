import express from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadProfilePhoto } from "../middleware/upload.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", requireAuth, authController.me);
router.post("/logout", requireAuth, authController.logout);
router.post("/forgot/verify", authController.verifyForgotPassword);
router.post("/forgot/reset", authController.resetForgotPassword);
router.get("/profile", requireAuth, authController.getProfile);
router.put("/profile", requireAuth, authController.updateProfile);
router.post("/profile/photo", requireAuth, uploadProfilePhoto, authController.uploadPhoto);
router.put("/password", requireAuth, authController.changePassword);

export default router;
