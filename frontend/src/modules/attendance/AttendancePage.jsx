import { ResourcePage } from "../../components/resource/ResourcePage.jsx";
import { attendanceConfig } from "./attendance.config.js";
import { AttendanceCalendar } from "./components/AttendanceCalendar.jsx";

// Attendance Details: month calendar under the title (own for employees/managers, any employee
// for admins), then the attendance records form and table.
export function AttendancePage({ user }) {
  return <ResourcePage config={attendanceConfig} user={user} intro={<AttendanceCalendar user={user} />} />;
}
