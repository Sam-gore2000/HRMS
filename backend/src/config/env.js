import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// All attendance dates ("2026-09-30") and clock times are calculated in this zone,
// so a server hosted in UTC still records the office's local day. Must be set before any Date use.
const timezone = process.env.APP_TIMEZONE || "Asia/Kolkata";
process.env.TZ = timezone;

export const env = {
  port: Number(process.env.PORT) || 5000,
  timezone,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hrms",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: "12h",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || path.resolve(srcDir, "../../uploads"),
  disableMemoryFallback: process.env.DISABLE_MEMORY_FALLBACK === "true",
  // Paid leave earned per month from the joining date.
  leaveAccrualPerMonth: Number.isFinite(parseFloat(process.env.LEAVE_ACCRUAL_PER_MONTH)) ? parseFloat(process.env.LEAVE_ACCRUAL_PER_MONTH) : 1.5,
  // Attendance calendar: WEEKLY_OFF_DAYS are the days off (0 = Sunday ... 6 = Saturday).
  weeklyOffDays: (process.env.WEEKLY_OFF_DAYS ?? "0,6").split(",").map((day) => Number(day.trim())).filter((day) => day >= 0 && day <= 6)
};
