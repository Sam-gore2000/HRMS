import { ROLES } from "../constants/app.js";
import { adminNav } from "./adminNav.js";
import { employeeNav } from "./employeeNav.js";
import { managerNav } from "./managerNav.js";

const navByRole = {
  [ROLES.ADMIN]: adminNav,
  [ROLES.MANAGER]: managerNav,
  [ROLES.EMPLOYEE]: employeeNav
};

export function navForRole(role) {
  return navByRole[role] || employeeNav;
}
