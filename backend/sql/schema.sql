CREATE TABLE IF NOT EXISTS "admin" (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "emp_details" (
  id SERIAL PRIMARY KEY,
  empid TEXT UNIQUE NOT NULL,
  username TEXT,
  pass TEXT NOT NULL,
  fname TEXT,
  about TEXT,
  email TEXT,
  phno TEXT,
  department TEXT,
  position TEXT,
  status TEXT DEFAULT 'Offline',
  jdate DATE,
  bdate DATE,
  "add" TEXT,
  edu TEXT,
  skills TEXT,
  report_manager TEXT,
  report_manager_id TEXT,
  offer_ctc TEXT,
  prev_company TEXT,
  prev_exp TEXT,
  padd TEXT,
  profile_pic TEXT,
  adhar_card TEXT,
  pan_card TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_log" (
  id SERIAL PRIMARY KEY,
  session_id BIGINT,
  emp_id TEXT,
  date DATE,
  in_timestamp TIME,
  out_timestamp TIME,
  sessTime TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS "attendance_data" (
  id SERIAL PRIMARY KEY,
  emp_id TEXT NOT NULL,
  attendance_date DATE NOT NULL,
  punch_in TIMESTAMPTZ,
  punch_out TIMESTAMPTZ,
  total_seconds INTEGER DEFAULT 0,
  status TEXT,
  UNIQUE (emp_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS "break_data" (
  id SERIAL PRIMARY KEY,
  emp_id TEXT NOT NULL,
  break_date DATE NOT NULL,
  break_in TIMESTAMPTZ,
  break_out TIMESTAMPTZ,
  total_seconds INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "user_leave" (
  id SERIAL PRIMARY KEY,
  fname TEXT,
  empid TEXT,
  report_manager_id TEXT,
  leavet TEXT,
  leave1 DATE,
  leave2 DATE,
  total_leave INTEGER DEFAULT 0,
  reason TEXT,
  response TEXT,
  status INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "attendance_res" (
  id SERIAL PRIMARY KEY,
  name TEXT,
  empid TEXT,
  report_manager_id TEXT,
  date DATE,
  punch_in TIMESTAMPTZ,
  punch_out TIMESTAMPTZ,
  reason TEXT,
  status INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "emp_query" (
  id SERIAL PRIMARY KEY,
  emp_id TEXT,
  emp_name TEXT,
  date DATE DEFAULT CURRENT_DATE,
  email TEXT,
  contact TEXT,
  subject TEXT,
  message TEXT,
  status INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bank_details" (
  id SERIAL PRIMARY KEY,
  empid TEXT,
  "employeeName" TEXT,
  designation TEXT,
  department TEXT,
  tsalary NUMERIC,
  bsalary NUMERIC,
  houserent NUMERIC,
  attendanceb NUMERIC,
  conveyance NUMERIC,
  medicalallowance NUMERIC,
  specialallowance NUMERIC,
  ptax NUMERIC,
  "accountNumber" TEXT,
  "bankName" TEXT,
  "branchName" TEXT,
  "ifscCode" TEXT
);

CREATE TABLE IF NOT EXISTS "payslip" (
  id SERIAL PRIMARY KEY,
  empid TEXT,
  "employeeName" TEXT,
  month TEXT,
  year INTEGER,
  tsalary NUMERIC,
  bsalary NUMERIC,
  "netSalary" NUMERIC,
  deductions NUMERIC,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "holiday" (
  id SERIAL PRIMARY KEY,
  hdname TEXT,
  hddate DATE,
  descr TEXT
);

CREATE TABLE IF NOT EXISTS "notice" (
  id SERIAL PRIMARY KEY,
  heading TEXT,
  descr TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "project" (
  id SERIAL PRIMARY KEY,
  project TEXT,
  description TEXT,
  date DATE,
  duedate DATE,
  budget NUMERIC,
  projectclient TEXT,
  status TEXT,
  app_type TEXT
);

CREATE TABLE IF NOT EXISTS "team_member" (
  id SERIAL PRIMARY KEY,
  team_name TEXT,
  team_lead TEXT,
  tmember_1 TEXT,
  tmember_2 TEXT,
  tmember_3 TEXT,
  tmember_4 TEXT,
  tmember_5 TEXT,
  tmember_6 TEXT,
  tmember_7 TEXT,
  tmember_8 TEXT,
  tmember_9 TEXT,
  tmember_10 TEXT
);

CREATE TABLE IF NOT EXISTS "assign_task" (
  id SERIAL PRIMARY KEY,
  emp_id TEXT,
  emp_project TEXT,
  emp_team TEXT,
  task TEXT,
  start_date DATE,
  due_date DATE,
  status TEXT,
  priority TEXT
);

CREATE TABLE IF NOT EXISTS "meeting" (
  id SERIAL PRIMARY KEY,
  organiser TEXT,
  team TEXT,
  emp TEXT,
  date DATE,
  time TIME,
  link TEXT,
  message TEXT
);

CREATE TABLE IF NOT EXISTS "dpr" (
  id SERIAL PRIMARY KEY,
  empid TEXT,
  workmode TEXT,
  pname TEXT,
  wout TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS "timesheet" (
  id SERIAL PRIMARY KEY,
  team TEXT,
  project TEXT,
  task TEXT,
  date DATE,
  enddate DATE,
  note TEXT
);

INSERT INTO "admin" (username, password, email)
VALUES ('admin', 'admin123', 'admin@lionreachmedia.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO "emp_details" (empid, username, pass, fname, email, position, department, report_manager_id)
VALUES
  ('MGR001', 'MGR001', 'manager123', 'Team Manager', 'manager@lionreachmedia.com', 'Manager', 'Operations', NULL),
  ('EMP001', 'EMP001', 'employee123', 'Employee User', 'employee@lionreachmedia.com', 'Employee', 'Marketing', 'MGR001')
ON CONFLICT (empid) DO NOTHING;
