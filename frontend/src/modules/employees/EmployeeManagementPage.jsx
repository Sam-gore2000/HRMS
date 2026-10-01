import { useState } from "react";
import { ResourcePage } from "../../components/resource/ResourcePage.jsx";
import { EmployeeProfileView } from "../profile/index.js";
import { employeesConfig } from "./employees.config.js";

// Employee Details (admin): list/add/edit employees, and "View Profile" for any of them.
export function EmployeeManagementPage({ user }) {
  const [viewing, setViewing] = useState(null);
  if (viewing) return <EmployeeProfileView empid={viewing} onBack={() => setViewing(null)} />;
  return <ResourcePage config={employeesConfig} user={user} onView={(row) => setViewing(row.empid)} viewLabel="View Profile" />;
}
