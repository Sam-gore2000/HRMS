import { ResourcePage } from "../../components/resource/ResourcePage.jsx";
import { leaveConfig } from "./leave.config.js";

export function LeaveManagementPage({ user }) {
  return <ResourcePage config={leaveConfig} user={user} />;
}
