import * as attendanceService from "../services/attendanceService.js";
import * as breakService from "../services/breakService.js";
import { handleRequest } from "../utils/handleRequest.js";

export const status = handleRequest((req) => attendanceService.status(req.user));
export const today = handleRequest((req) => attendanceService.today(req.user));
export const punchIn = handleRequest((req) => attendanceService.punchIn(req.user));
export const punchOut = handleRequest((req) => attendanceService.punchOut(req.user));
export const toggle = handleRequest((req) => attendanceService.toggle(req.user));
export const report = handleRequest((req) => attendanceService.report(req.user, req.query));
export const monthlyReport = handleRequest((req) => attendanceService.monthlyReport(req.query));
export const breaksToday = handleRequest((req) => breakService.breaksToday(req.user));
export const startBreak = handleRequest((req) => breakService.startBreak(req.user));
export const stopBreak = handleRequest((req) => breakService.stopBreak(req.user));
export const toggleBreak = handleRequest((req) => breakService.toggleBreak(req.user));
