# Attendance + Break update (2026-09-30)

## Install
1. Copy this `HRMS/` folder over your project (23 files; nothing else is touched).
2. Add this line to `backend/.env`:  `APP_TIMEZONE=Asia/Kolkata`
3. STOP every running backend first. An old server still holding port 5000 is what caused "Route not found":
   - Windows:     `netstat -ano | findstr :5000`  then  `taskkill /PID <pid> /F`
   - macOS/Linux: `lsof -i :5000`  then  `kill <pid>`
4. `cd backend && npm run dev`. The console must show `HRMS API 2026.09.30-attendance-breaks`.
5. Open http://localhost:5000/api/health and check it says `"version": "2026.09.30-attendance-breaks"`.
6. `cd frontend && npm run dev` (or `npm run build` for production).

## New API (all behind login)
| Method | Path                                                  | Who        |
|--------|-------------------------------------------------------|------------|
| GET    | /api/attendance/status                                | all roles  |
| POST   | /api/attendance/punch-in                              | all roles  |
| POST   | /api/attendance/punch-out                             | all roles  |
| POST   | /api/attendance/breaks/start                          | all roles  |
| POST   | /api/attendance/breaks/stop                           | all roles  |
| GET    | /api/attendance/report/monthly?month=YYYY-MM[&emp_id=] | admin only |

The old `/toggle`, `/today`, `/breaks/toggle` and `/breaks/today` still work.

## Rules
- One attendance record per person per day (unique index). Double-clicks are ignored.
- A break needs an open punch-in, and only one break can run at a time.
- Work time = punch-in to punch-out minus breaks (the work timer pauses during a break).
- Punching out while on break ends the break at the same moment.
- Under 4h worked = Half Day. If someone forgets to punch out, their next punch-in marks that day "Missed Punch Out".
- Managers' "Team Attendance" now shows only their team (for rows punched in from this update onwards).
