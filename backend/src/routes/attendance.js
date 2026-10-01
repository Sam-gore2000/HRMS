import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";
import { requireAdmin } from "../middleware/roles.js";

// Mounted at /api/attendance behind requireAuth. Punch and break actions work for every role.
const router = express.Router();

router.get("/status", attendanceController.status);
router.get("/today", attendanceController.today);
router.post("/punch-in", attendanceController.punchIn);
router.post("/punch-out", attendanceController.punchOut);
router.post("/toggle", attendanceController.toggle);

router.get("/breaks/today", attendanceController.breaksToday);
router.post("/breaks/start", attendanceController.startBreak);
router.post("/breaks/stop", attendanceController.stopBreak);
router.post("/breaks/toggle", attendanceController.toggleBreak);

router.get("/report", attendanceController.report);
router.get("/report/monthly", requireAdmin, attendanceController.monthlyReport);

export default router;
