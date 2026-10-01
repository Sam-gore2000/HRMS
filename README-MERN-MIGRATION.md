# HRMS React + Express + MongoDB Migration

This project keeps the requested stack:

- `frontend/` - React + Vite HRMS portal UI.
- `backend/` - Node.js + Express API.
- Database - MongoDB with Mongoose models using legacy collection names.
- Legacy PHP folders (`admin_dashboard/`, `manager_dashboard/`, `employee_dashboard/`) remain for reference during migration.

## Frontend Organization

```
frontend/src/
  App.jsx                 Auth gate: LoginPage or AppLayout
  app/                    AppLayout (sidebar + header + page + footer), PageRouter
  modules/                One folder per feature module
    registry.js           Page key -> module lookup used by PageRouter
    auth/                 LoginPage, useAuth, authApi
    dashboard/            DashboardPage, stat/weekly/notice/policy components, static data
    attendance/           AttendancePage, AttendanceCard (punch + break tracker), useAttendanceTracker,
                          break report + attendance request configs
    leave/                LeaveManagementPage + leave form config
    payslip/              PayslipPage + config
    employees/            EmployeeManagementPage + config
    compensation/         CompensationPage (bank details) + config
    profile/              ProfilePage, EditProfileForm, ChangePasswordForm
    handbook/             HandbookPage
    holidays/ notices/ queries/ projects/ teams/ tasks/ meetings/
    dailyReports/ timesheets/ adminAccess/ loginLogs/
                          Config-only modules rendered by the shared ResourcePage
  navigation/             adminNav, managerNav, employeeNav (sidebar per role)
  components/
    common/               PageTitle, Card, Alert
    forms/                Field, FormFields
    tables/               ResourceTable, RowActions
    resource/             ResourcePage, ResourceForm, SearchBar, useResource (generic CRUD)
    layout/               Header (+ header/ parts), Sidebar, Footer
  hooks/                  useTheme, useSidebar, useNow, useFormState
  services/               api (HTTP client), resourceApi
  constants/ utils/       App constants, formatting helpers
```

Each module's `index.js` exports a descriptor: `{ key, Page }` for a module with its own page,
or `{ key, config }` for one rendered by the generic `ResourcePage`. A resource config holds:
`resource` (backend key), `fields` (form definition), `selfService` (non-admins may add/edit),
and `approvable` (managers/admins get Approve/Reject).

**Adding a module:** create `modules/<name>/` with a config and `index.js`, register it in
`modules/registry.js`, and add a sidebar entry to the relevant `navigation/<role>Nav.js`.

## Backend Organization

```
backend/src/
  server.js               Bootstrap: connect MongoDB (or fall back to memory store), listen
  app.js                  Express app: security middleware, /api routes, error handling
  config/                 env, db, cors, resources (metadata for /api/resources/:resource)
  constants/              roles
  routes/                 Route declarations only (index.js mounts everything)
  controllers/            Thin request/response adapters
  services/               Business logic: auth, sessionLog, profile, dashboard, attendance, break, resource
  models/                 One Mongoose schema per file + legacyModels + registry (index.js)
  middleware/             requireAuth, role guards, notFound/errorHandler
  utils/                  handleRequest, httpError, token, authCookie, password, query, date
  data/                   seedData, in-memory model adapter + store (MongoDB-down fallback)
  roles/
    admin/                adminRoutes, adminController, adminService, adminPolicy
    manager/              managerRoutes, managerController, managerService, managerPolicy
    employee/             employeeRoutes, employeeController, employeeService, employeePolicy
    index.js              getRoleModule(role)
```

Role-specific rules live in each role module:

- `*Policy.js` decides which resources the role may use and scopes queries to the rows it may see.
  For example, employees see only their own rows, and managers see their team's leaves and attendance requests.
- `*Service.js` holds role-only logic such as dashboard stats, the admin overview, and manager team/approvals.
- `*Routes.js` mounts at `/api/admin`, `/api/manager`, and `/api/employee`, behind the matching role guard.

**Memory mode:** when MongoDB is unreachable, `data/memoryStore.js` swaps every model in the registry
for an in-memory stand-in (`data/memoryModel.js`) seeded from `data/seedData.js`. All services and
access rules run unchanged; data is lost on restart. Set `DISABLE_MEMORY_FALLBACK=true` to fail instead.

## Backend Setup

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

Default API URL: `http://localhost:5000/api`

Seed logins (work in both MongoDB and memory mode):

- Test employee: `testuser` / `test123`
- Admin: `admin` / `admin123`
- Manager: `MGR001` / `manager123`
- Employee: `EMP001` / `employee123`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Set `VITE_API_BASE_URL` only if the backend runs elsewhere:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Migrated Functional Areas

- Role-based login for admin, manager, and employee.
- Dark/light theme, responsive sidebar, header clock, logout, birthday/work-anniversary notifications.
- Dashboard stats, notices, attendance punch in/out, break start/end, weekly overview, and company policies.
- CRUD/resource modules for employees, leaves, attendance, breaks, compensation/bank details, payslips, holidays, notices, queries, projects, teams, tasks, meetings, DPRs, timesheets, login logs, and attendance requests.
- Role-specific backend modules for admin, manager, and employee workflows.
- Profile edit and password change for employees/managers.
- Employee handbook PDF viewer/download.

## Mongo Collection Mapping

The backend keeps legacy collection names to make data migration from PHP/MySQL straightforward:

- `admin`
- `emp_details`
- `attendance_data`
- `break_data`
- `user_leave`
- `bank_details`
- `payslip`
- `holiday`
- `notice`
- `emp_query`
- `project`
- `team_member`
- `assign_task`
- `meeting`
- `dpr`
- `timesheet`
- `user_log`
- `attendance_res`
