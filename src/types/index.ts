export type EnrollmentStatus = "active" | "inactive" | "alumni" | "pending";
export type StaffStatus = "active" | "on-leave" | "resigned";
export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "unmarked";
export type PaymentMethod = "Cash" | "UPI" | "Bank Transfer" | "Card" | "Other";
export type PaymentStatus = "success" | "pending" | "failed" | "refunded";
export type ChargeStatus = "paid" | "pending" | "overdue" | "partial";
export type AnnouncementStatus = "draft" | "published" | "scheduled";
export type UserRole = "School Owner" | "Principal" | "Administrator" | "Accountant" | "Teacher";
export type SchoolStatus = "active" | "trial" | "suspended" | "archived";

export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  academicYear: string;
  timezone: string;
  currency: string;
  planId: string;
  status: SchoolStatus;
  location: string;
  joinedDate: string;
  entitlements: string[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "disabled";
}

export interface Guardian {
  id: string;
  studentId: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  admissionNumber: string;
  academicYear: string;
  classId: string;
  sectionId: string;
  admissionDate: string;
  status: EnrollmentStatus;
  guardianIds: string[];
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  designation: string;
  joiningDate: string;
  classIds: string[];
  status: StaffStatus;
}

export interface SchoolClass {
  id: string;
  name: string;
  academicYear: string;
  status: "active" | "archived";
}

export interface Section {
  id: string;
  classId: string;
  name: string;
  teacherId?: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  classId: string;
  sectionId: string;
  records: AttendanceRecord[];
  savedAt?: string;
}

export interface FeeCategory {
  name: string;
  amount: number;
}

export interface FeeStructure {
  id: string;
  academicYear: string;
  classId: string;
  categories: FeeCategory[];
}

export interface StudentCharge {
  id: string;
  studentId: string;
  academicYear: string;
  category: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: ChargeStatus;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  studentId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: "Entire school" | "Teachers" | "Parents" | "Selected classes";
  classIds?: string[];
  status: AnnouncementStatus;
  publishDate?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  studentLimit: number;
  modules: string[];
  activeSchools: number;
  description: string;
  popular?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}
