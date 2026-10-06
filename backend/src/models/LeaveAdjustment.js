import mongoose from "mongoose";
import { baseOptions } from "./schemaOptions.js";

// Manual changes to an employee's paid leave balance made by an admin (kept as a history).
const leaveAdjustmentSchema = new mongoose.Schema(
  {
    empid: { type: String, index: true },
    days: Number, // + adds leave, - removes leave
    reason: String,
    mode: String, // "set" (balance set to a value) or "add" (days added / removed)
    balance_before: Number,
    balance_after: Number,
    by: String // admin username
  },
  baseOptions
);

export default mongoose.model("LeaveAdjustment", leaveAdjustmentSchema, "leave_adjustments");
