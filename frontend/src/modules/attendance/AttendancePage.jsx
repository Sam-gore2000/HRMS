import { ResourcePage } from "../../components/resource/ResourcePage.jsx";
import { attendanceConfig } from "./attendance.config.js";

export function AttendancePage({ user }) {
  return <ResourcePage config={attendanceConfig} user={user} />;
}
