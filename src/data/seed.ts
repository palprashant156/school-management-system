import type {
  Announcement,
  AppUser,
  Guardian,
  Payment,
  Plan,
  School,
  SchoolClass,
  SchoolEvent,
  Section,
  Staff,
  Student,
  StudentCharge,
  FeeStructure,
} from "@/types";

export const ACADEMIC_YEARS = ["2024-25", "2025-26", "2026-27"];
export const CURRENT_YEAR = "2025-26";

export const currentSchool: School = {
  id: "sch-001",
  name: "Vidya Valley Public School",
  code: "VVPS-1024",
  address: "14 HSR Layout, Sector 2",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560102",
  phone: "+91 80 4719 2200",
  email: "office@vidyavalley.edu.in",
  academicYear: CURRENT_YEAR,
  timezone: "Asia/Kolkata",
  currency: "INR",
  planId: "plan-growth",
  status: "active",
  location: "Bengaluru, Karnataka",
  joinedDate: "2023-06-12",
  entitlements: ["students", "staff", "classes", "attendance", "fees", "announcements", "reports", "settings"],
};

export const plans: Plan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    priceMonthly: 2499,
    priceYearly: 24990,
    studentLimit: 500,
    modules: ["Students", "Attendance", "Announcements", "Reports"],
    activeSchools: 128,
    description: "For small schools getting started with digital records.",
  },
  {
    id: "plan-growth",
    name: "Growth",
    priceMonthly: 4999,
    priceYearly: 49990,
    studentLimit: 2500,
    modules: ["Students", "Staff", "Classes", "Attendance", "Fees & Finance", "Announcements", "Reports"],
    activeSchools: 342,
    description: "For growing private schools that need fees and staff tooling.",
    popular: true,
  },
  {
    id: "plan-campus",
    name: "Campus",
    priceMonthly: 9999,
    priceYearly: 99990,
    studentLimit: 10000,
    modules: ["Everything in Growth", "Multi-branch", "Transport", "Advanced reports", "Priority support"],
    activeSchools: 86,
    description: "For large campuses and multi-branch groups.",
  },
];

export const platformSchools: School[] = [
  currentSchool,
  {
    id: "sch-002",
    name: "St. Mary's Convent School",
    code: "SMCS-0881",
    address: "MG Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    phone: "+91 20 4000 1122",
    email: "admin@stmarys.edu.in",
    academicYear: CURRENT_YEAR,
    timezone: "Asia/Kolkata",
    currency: "INR",
    planId: "plan-starter",
    status: "active",
    location: "Pune, Maharashtra",
    joinedDate: "2023-09-02",
    entitlements: ["students", "attendance", "announcements", "reports"],
  },
  {
    id: "sch-003",
    name: "Delhi Scholars Academy",
    code: "DSA-3302",
    address: "Dwarka Sector 6",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110075",
    phone: "+91 11 4555 8899",
    email: "hello@delhischolars.in",
    academicYear: CURRENT_YEAR,
    timezone: "Asia/Kolkata",
    currency: "INR",
    planId: "plan-campus",
    status: "active",
    location: "New Delhi, Delhi",
    joinedDate: "2022-11-18",
    entitlements: ["students", "staff", "classes", "attendance", "fees", "announcements", "reports", "settings"],
  },
  {
    id: "sch-004",
    name: "Kaveri Vidyalaya",
    code: "KV-5110",
    address: "Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    phone: "+91 44 2621 3344",
    email: "office@kaverividyalaya.in",
    academicYear: CURRENT_YEAR,
    timezone: "Asia/Kolkata",
    currency: "INR",
    planId: "plan-growth",
    status: "trial",
    location: "Chennai, Tamil Nadu",
    joinedDate: "2025-04-21",
    entitlements: ["students", "attendance", "fees", "reports"],
  },
  {
    id: "sch-005",
    name: "Lotus International School",
    code: "LIS-2093",
    address: "Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    phone: "+91 40 4855 6677",
    email: "admin@lotusintl.in",
    academicYear: CURRENT_YEAR,
    timezone: "Asia/Kolkata",
    currency: "INR",
    planId: "plan-growth",
    status: "suspended",
    location: "Hyderabad, Telangana",
    joinedDate: "2022-03-10",
    entitlements: ["students", "attendance"],
  },
  {
    id: "sch-006",
    name: "Greenwood High Junior",
    code: "GWH-7712",
    address: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560066",
    phone: "+91 80 3999 0011",
    email: "contact@greenwoodjr.in",
    academicYear: CURRENT_YEAR,
    timezone: "Asia/Kolkata",
    currency: "INR",
    planId: "plan-starter",
    status: "active",
    location: "Bengaluru, Karnataka",
    joinedDate: "2024-01-15",
    entitlements: ["students", "staff", "attendance", "announcements"],
  },
];

export const users: AppUser[] = [
  { id: "u-1", name: "Ananya Sharma", email: "ananya@vidyavalley.edu.in", role: "School Owner", status: "active" },
  { id: "u-2", name: "Rajesh Iyer", email: "rajesh@vidyavalley.edu.in", role: "Principal", status: "active" },
  { id: "u-3", name: "Priya Nair", email: "priya@vidyavalley.edu.in", role: "Administrator", status: "active" },
  { id: "u-4", name: "Amit Verma", email: "amit@vidyavalley.edu.in", role: "Accountant", status: "active" },
  { id: "u-5", name: "Kavitha Rao", email: "kavitha@vidyavalley.edu.in", role: "Teacher", status: "active" },
  { id: "u-6", name: "Suresh Menon", email: "suresh@vidyavalley.edu.in", role: "Teacher", status: "invited" },
];

export const currentUser: AppUser = users[2];

export const classes: SchoolClass[] = [
  { id: "c-1", name: "Class 1", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-2", name: "Class 2", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-3", name: "Class 3", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-4", name: "Class 4", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-5", name: "Class 5", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-6", name: "Class 6", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-7", name: "Class 7", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-8", name: "Class 8", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-9", name: "Class 9", academicYear: CURRENT_YEAR, status: "active" },
  { id: "c-10", name: "Class 10", academicYear: CURRENT_YEAR, status: "active" },
];

export const sections: Section[] = [
  { id: "s-1a", classId: "c-1", name: "A", teacherId: "st-1" },
  { id: "s-1b", classId: "c-1", name: "B", teacherId: "st-2" },
  { id: "s-2a", classId: "c-2", name: "A", teacherId: "st-3" },
  { id: "s-3a", classId: "c-3", name: "A", teacherId: "st-4" },
  { id: "s-4a", classId: "c-4", name: "A", teacherId: "st-5" },
  { id: "s-5a", classId: "c-5", name: "A", teacherId: "st-6" },
  { id: "s-5b", classId: "c-5", name: "B", teacherId: "st-7" },
  { id: "s-6a", classId: "c-6", name: "A", teacherId: "st-8" },
  { id: "s-7a", classId: "c-7", name: "A", teacherId: "st-9" },
  { id: "s-8a", classId: "c-8", name: "A", teacherId: "st-5" },
  { id: "s-9a", classId: "c-9", name: "A", teacherId: "st-10" },
  { id: "s-10a", classId: "c-10", name: "A", teacherId: "st-11" },
];

export const staff: Staff[] = [
  { id: "st-1", name: "Meera Krishnan", employeeId: "EMP-001", email: "meera.k@vidyavalley.edu.in", phone: "+91 98450 11223", designation: "Primary Teacher", joiningDate: "2019-06-10", classIds: ["c-1"], status: "active" },
  { id: "st-2", name: "Rahul Gupta", employeeId: "EMP-002", email: "rahul.g@vidyavalley.edu.in", phone: "+91 98451 22334", designation: "Primary Teacher", joiningDate: "2020-07-01", classIds: ["c-1"], status: "active" },
  { id: "st-3", name: "Divya Shetty", employeeId: "EMP-003", email: "divya.s@vidyavalley.edu.in", phone: "+91 98452 33445", designation: "Primary Teacher", joiningDate: "2018-06-15", classIds: ["c-2"], status: "active" },
  { id: "st-4", name: "Arun Kumar", employeeId: "EMP-004", email: "arun.k@vidyavalley.edu.in", phone: "+91 98453 44556", designation: "Mathematics Teacher", joiningDate: "2017-08-20", classIds: ["c-3", "c-4"], status: "active" },
  { id: "st-5", name: "Kavitha Rao", employeeId: "EMP-005", email: "kavitha@vidyavalley.edu.in", phone: "+91 98454 55667", designation: "Science Teacher", joiningDate: "2016-06-01", classIds: ["c-4", "c-8"], status: "active" },
  { id: "st-6", name: "Suresh Menon", employeeId: "EMP-006", email: "suresh@vidyavalley.edu.in", phone: "+91 98455 66778", designation: "English Teacher", joiningDate: "2021-06-12", classIds: ["c-5"], status: "active" },
  { id: "st-7", name: "Pooja Desai", employeeId: "EMP-007", email: "pooja.d@vidyavalley.edu.in", phone: "+91 98456 77889", designation: "Social Studies Teacher", joiningDate: "2020-01-15", classIds: ["c-5"], status: "on-leave" },
  { id: "st-8", name: "Vikram Singh", employeeId: "EMP-008", email: "vikram.s@vidyavalley.edu.in", phone: "+91 98457 88990", designation: "Mathematics Teacher", joiningDate: "2019-09-02", classIds: ["c-6"], status: "active" },
  { id: "st-9", name: "Lakshmi Venkat", employeeId: "EMP-009", email: "lakshmi.v@vidyavalley.edu.in", phone: "+91 98458 99001", designation: "Hindi Teacher", joiningDate: "2015-06-08", classIds: ["c-7"], status: "active" },
  { id: "st-10", name: "Imran Khan", employeeId: "EMP-010", email: "imran.k@vidyavalley.edu.in", phone: "+91 98459 00112", designation: "Physical Education", joiningDate: "2022-06-20", classIds: ["c-9"], status: "active" },
  { id: "st-11", name: "Nandini Patel", employeeId: "EMP-011", email: "nandini.p@vidyavalley.edu.in", phone: "+91 98460 11223", designation: "Senior Teacher", joiningDate: "2014-07-01", classIds: ["c-10"], status: "active" },
  { id: "st-12", name: "Amit Verma", employeeId: "EMP-012", email: "amit@vidyavalley.edu.in", phone: "+91 98461 22334", designation: "Accountant", joiningDate: "2021-03-11", classIds: [], status: "active" },
];

const firstNames: [string, string, string][] = [
  ["Aarav", "Sharma", "Male"], ["Diya", "Patel", "Female"], ["Arjun", "Reddy", "Male"],
  ["Ananya", "Iyer", "Female"], ["Vihaan", "Gupta", "Male"], ["Ishaan", "Mehta", "Male"],
  ["Saanvi", "Nair", "Female"], ["Kabir", "Singh", "Male"], ["Myra", "Joshi", "Female"],
  ["Aditya", "Kumar", "Male"], ["Navya", "Menon", "Female"], ["Krishna", "Pillai", "Male"],
  ["Riya", "Desai", "Female"], ["Aryan", "Khan", "Male"], ["Pari", "Verma", "Female"],
  ["Rudra", "Yadav", "Male"], ["Avni", "Rao", "Female"], ["Yash", "Thakur", "Male"],
  ["Zara", "Sheikh", "Female"], ["Dev", "Malhotra", "Male"], ["Ira", "Kulkarni", "Female"],
  ["Vivaan", "Chopra", "Male"], ["Anvi", "Bhatt", "Female"], ["Atharv", "Jain", "Male"],
];

const guardianNames = [
  ["Rajesh Sharma", "Father"], ["Priya Sharma", "Mother"],
  ["Sanjay Patel", "Father"], ["Meena Patel", "Mother"],
  ["Venkat Reddy", "Father"], ["Lakshmi Reddy", "Mother"],
  ["Suresh Iyer", "Father"], ["Kavitha Iyer", "Mother"],
  ["Amit Gupta", "Father"], ["Neha Gupta", "Mother"],
  ["Ravi Mehta", "Father"], ["Shalini Mehta", "Mother"],
  ["Mohan Nair", "Father"], ["Divya Nair", "Mother"],
  ["Harpreet Singh", "Father"], ["Simran Singh", "Mother"],
];

const sectionCycle = ["s-1a", "s-1b", "s-2a", "s-3a", "s-4a", "s-5a", "s-5b", "s-6a", "s-7a", "s-8a", "s-9a", "s-10a"];

function classOfSection(sectionId: string): string {
  const s = sections.find((x) => x.id === sectionId);
  return s ? s.classId : "c-1";
}

export const students: Student[] = firstNames.map(([fn, ln, gender], i) => {
  const sectionId = sectionCycle[i % sectionCycle.length];
  const n = i + 1;
  return {
    id: `stu-${String(n).padStart(3, "0")}`,
    firstName: fn,
    lastName: ln,
    dob: `20${12 - (i % 8)}-0${(i % 9) + 1}-1${i % 9}`,
    gender,
    admissionNumber: `VVPS-2024-${String(1000 + n)}`,
    academicYear: CURRENT_YEAR,
    classId: classOfSection(sectionId),
    sectionId,
    admissionDate: "2024-06-0" + ((i % 9) + 1),
    status: i === 20 ? "inactive" : i === 21 ? "pending" : "active",
    guardianIds: [],
    address: `${10 + i} Cross, HSR Layout`,
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "56010" + (i % 9),
  };
});

export const guardians: Guardian[] = students.map((s, i) => {
  const [gname, rel] = guardianNames[i % guardianNames.length];
  return {
    id: `g-${s.id}`,
    studentId: s.id,
    name: `${gname.split(" ")[0]} ${s.lastName}`,
    relationship: rel,
    phone: `+91 98${String(400 + i)} ${String(10000 + i * 137).slice(0, 5)}`,
    email: `guardian.${s.id}@example.in`,
    isPrimary: true,
  };
});

students.forEach((s) => {
  s.guardianIds = [`g-${s.id}`];
});

export const feeStructures: FeeStructure[] = classes.slice(0, 6).map((c, i) => ({
  id: `fs-${c.id}`,
  academicYear: CURRENT_YEAR,
  classId: c.id,
  categories: [
    { name: "Tuition Fee", amount: 28000 + i * 1500 },
    { name: "Admission Fee", amount: 8000 },
    { name: "Examination Fee", amount: 3500 },
    { name: "Transport Fee", amount: 12000 },
    { name: "Activity Fee", amount: 4500 },
  ],
}));

export const studentCharges: StudentCharge[] = students.slice(0, 18).flatMap((s, i) => [
  {
    id: `ch-${s.id}-tuit`,
    studentId: s.id,
    academicYear: CURRENT_YEAR,
    category: "Tuition Fee",
    amount: 30000,
    paidAmount: i % 4 === 0 ? 0 : i % 4 === 1 ? 15000 : 30000,
    dueDate: "2025-09-10",
    status: (i % 4 === 0 ? "overdue" : i % 4 === 1 ? "partial" : "paid") as StudentCharge["status"],
  },
  {
    id: `ch-${s.id}-trans`,
    studentId: s.id,
    academicYear: CURRENT_YEAR,
    category: "Transport Fee",
    amount: 12000,
    paidAmount: i % 3 === 0 ? 0 : 12000,
    dueDate: "2025-09-10",
    status: (i % 3 === 0 ? "pending" : "paid") as StudentCharge["status"],
  },
]);

export const payments: Payment[] = [
  { id: "pay-001", receiptNumber: "RCP-2025-0001", studentId: "stu-003", date: "2025-10-02", amount: 30000, method: "UPI", status: "success", reference: "UPI/4829103371" },
  { id: "pay-002", receiptNumber: "RCP-2025-0002", studentId: "stu-005", date: "2025-10-03", amount: 15000, method: "Bank Transfer", status: "success", reference: "NEFT-88231" },
  { id: "pay-003", receiptNumber: "RCP-2025-0003", studentId: "stu-007", date: "2025-10-04", amount: 42000, method: "Card", status: "success" },
  { id: "pay-004", receiptNumber: "RCP-2025-0004", studentId: "stu-002", date: "2025-10-06", amount: 12000, method: "Cash", status: "success" },
  { id: "pay-005", receiptNumber: "RCP-2025-0005", studentId: "stu-009", date: "2025-10-07", amount: 30000, method: "UPI", status: "success", reference: "UPI/9912004412" },
  { id: "pay-006", receiptNumber: "RCP-2025-0006", studentId: "stu-011", date: "2025-10-08", amount: 8000, method: "Cash", status: "pending" },
  { id: "pay-007", receiptNumber: "RCP-2025-0007", studentId: "stu-014", date: "2025-09-28", amount: 25000, method: "Bank Transfer", status: "success" },
  { id: "pay-008", receiptNumber: "RCP-2025-0008", studentId: "stu-016", date: "2025-09-25", amount: 42000, method: "UPI", status: "success" },
];

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Diwali holidays — school closed 20–24 Oct",
    message: "Dear parents, the school will remain closed for Diwali break from 20th to 24th October. Classes resume on 27th October. Wishing everyone a safe and happy Diwali.",
    audience: "Entire school",
    status: "published",
    publishDate: "2025-10-08",
    createdAt: "2025-10-08",
  },
  {
    id: "ann-2",
    title: "Term 2 examination timetable released",
    message: "The Term 2 timetable for Classes 6–10 is now available with class teachers. Please ensure fee dues are cleared before hall tickets are issued.",
    audience: "Selected classes",
    classIds: ["c-6", "c-7", "c-8", "c-9", "c-10"],
    status: "published",
    publishDate: "2025-10-05",
    createdAt: "2025-10-05",
  },
  {
    id: "ann-3",
    title: "Parent-teacher meeting — Class 5",
    message: "PTM for Class 5 A & B is scheduled for Saturday, 18 Oct at 10 AM in the respective classrooms. Please bring the student's diary.",
    audience: "Parents",
    status: "published",
    publishDate: "2025-10-03",
    createdAt: "2025-10-03",
  },
  {
    id: "ann-4",
    title: "Staff meeting — attendance process refresher",
    message: "All class teachers: short 30-min refresher on marking attendance in SchoolOS on Friday 4 PM in the staff room.",
    audience: "Teachers",
    status: "draft",
    createdAt: "2025-10-10",
  },
  {
    id: "ann-5",
    title: "Annual sports day trials",
    message: "Trials for the annual sports day begin next week. Interested students from Classes 4–9 should register with the PE teacher.",
    audience: "Entire school",
    status: "scheduled",
    publishDate: "2025-10-15",
    createdAt: "2025-10-09",
  },
];

export const schoolEvents: SchoolEvent[] = [
  { id: "ev-1", title: "Diwali Break", date: "2025-10-20", type: "Holiday" },
  { id: "ev-2", title: "Term 2 Exams Begin (VI–X)", date: "2025-11-03", type: "Exam" },
  { id: "ev-3", title: "Parent-Teacher Meeting", date: "2025-10-18", type: "Meeting" },
  { id: "ev-4", title: "Annual Sports Day", date: "2025-12-06", type: "Event" },
  { id: "ev-5", title: "Science Exhibition", date: "2025-11-22", type: "Event" },
];

export const monthlyFeeCollection = [
  { month: "May", collected: 820000 },
  { month: "Jun", collected: 1240000 },
  { month: "Jul", collected: 1180000 },
  { month: "Aug", collected: 1310000 },
  { month: "Sep", collected: 1420000 },
  { month: "Oct", collected: 690000 },
];

export const attendanceTrend = [
  { day: "Mon", present: 92 },
  { day: "Tue", present: 94 },
  { day: "Wed", present: 89 },
  { day: "Thu", present: 95 },
  { day: "Fri", present: 91 },
  { day: "Sat", present: 78 },
];

export function className(id: string): string {
  return classes.find((c) => c.id === id)?.name ?? "—";
}

export function sectionName(id: string): string {
  const s = sections.find((x) => x.id === id);
  if (!s) return "—";
  return `${className(s.classId)} ${s.name}`;
}

export function studentName(id: string): string {
  const s = students.find((x) => x.id === id);
  return s ? `${s.firstName} ${s.lastName}` : "Unknown";
}
