"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type {
  Announcement,
  AppUser,
  AttendanceSession,
  FeeStructure,
  Payment,
  School,
  SchoolClass,
  Section,
  Staff,
  Student,
  Guardian,
  StudentCharge,
} from "@/types";
import {
  announcements as seedAnn,
  classes as seedClasses,
  currentSchool,
  currentUser,
  guardians as seedGuardians,
  payments as seedPayments,
  platformSchools as seedPlatform,
  sections as seedSections,
  staff as seedStaff,
  studentCharges as seedCharges,
  students as seedStudents,
  feeStructures as seedFees,
  users as seedUsers,
} from "@/data/seed";

export interface ToastMsg {
  id: number;
  title: string;
  desc?: string;
  kind: "success" | "error" | "info";
}

interface StoreState {
  hydrated: boolean;
  school: School;
  academicYear: string;
  students: Student[];
  guardians: Guardian[];
  staff: Staff[];
  classes: SchoolClass[];
  sections: Section[];
  payments: Payment[];
  charges: StudentCharge[];
  feeStructures: FeeStructure[];
  announcements: Announcement[];
  users: AppUser[];
  platformSchools: School[];
  sessions: AttendanceSession[];
  toasts: ToastMsg[];
}

interface StoreApi extends StoreState {
  setAcademicYear: (y: string) => void;
  toast: (t: Omit<ToastMsg, "id">) => void;
  dismissToast: (id: number) => void;
  addStudent: (s: Student, g: Guardian) => { ok: boolean; error?: string };
  updateStudent: (id: string, patch: Partial<Student>, gpatch?: Partial<Guardian>) => void;
  changeStudentStatus: (id: string, status: Student["status"]) => void;
  addStaff: (s: Staff) => { ok: boolean; error?: string };
  updateStaff: (id: string, patch: Partial<Staff>) => void;
  addClass: (name: string) => { ok: boolean; error?: string };
  addSection: (classId: string, name: string) => { ok: boolean; error?: string };
  assignTeacher: (sectionId: string, teacherId: string) => void;
  saveAttendance: (s: AttendanceSession) => void;
  getSession: (date: string, classId: string, sectionId: string) => AttendanceSession | undefined;
  addPayment: (p: Payment, chargeUpdates?: { id: string; paidAmount: number; status: StudentCharge["status"] }[]) => void;
  upsertFeeStructure: (fs: FeeStructure) => void;
  addAnnouncement: (a: Announcement) => void;
  updateAnnouncement: (id: string, patch: Partial<Announcement>) => void;
  inviteUser: (u: AppUser) => void;
  updateUserStatus: (id: string, status: AppUser["status"]) => void;
  updateSchool: (patch: Partial<School>) => void;
  updatePlatformSchool: (id: string, patch: Partial<School>) => void;
  addPlatformSchool: (s: School) => void;
  resetDemo: () => void;
}

const Ctx = createContext<StoreApi | null>(null);
const KEY = "schoolos-demo-v1";

function seedState(): Omit<StoreState, "hydrated" | "toasts"> {
  return {
    school: currentSchool,
    academicYear: currentSchool.academicYear,
    students: seedStudents,
    guardians: seedGuardians,
    staff: seedStaff,
    classes: seedClasses,
    sections: seedSections,
    payments: seedPayments,
    charges: seedCharges,
    feeStructures: seedFees,
    announcements: seedAnn,
    users: seedUsers,
    platformSchools: seedPlatform,
    sessions: [],
  };
}

let toastId = 1;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(() => ({ ...seedState(), hydrated: false, toasts: [] }));

  // Client-only hydration from browser storage (avoids SSR access + hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...s, ...parsed, hydrated: true, toasts: [] }));
      } else {
        setState((s) => ({ ...s, hydrated: true }));
      }
    } catch {
      setState((s) => ({ ...s, hydrated: true }));
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { hydrated: _hydrated, toasts: _toasts, ...persist } = state;
      void _hydrated;
      void _toasts;
      localStorage.setItem(KEY, JSON.stringify(persist));
    } catch {
      /* ignore */
    }
  }, [state]);

  const toast = useCallback((t: Omit<ToastMsg, "id">) => {
    const id = toastId++;
    setState((s) => ({ ...s, toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => {
      setState((s) => ({ ...s, toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setState((s) => ({ ...s, toasts: s.toasts.filter((x) => x.id !== id) }));
  }, []);

  const api: StoreApi = useMemo(
    () => ({
      ...state,
      setAcademicYear: (y) => setState((s) => ({ ...s, academicYear: y })),
      toast,
      dismissToast,
      addStudent: (st, g) => {
        let err: string | undefined;
        setState((s) => {
          if (s.students.some((x) => x.admissionNumber.toLowerCase() === st.admissionNumber.toLowerCase())) {
            err = "Duplicate admission number";
            return s;
          }
          return { ...s, students: [st, ...s.students], guardians: [g, ...s.guardians] };
        });
        return err ? { ok: false, error: err } : { ok: true };
      },
      updateStudent: (id, patch, gpatch) =>
        setState((s) => ({
          ...s,
          students: s.students.map((x) => (x.id === id ? { ...x, ...patch } : x)),
          guardians: gpatch
            ? s.guardians.map((g) => (g.studentId === id && g.isPrimary ? { ...g, ...gpatch } : g))
            : s.guardians,
        })),
      changeStudentStatus: (id, status) =>
        setState((s) => ({ ...s, students: s.students.map((x) => (x.id === id ? { ...x, status } : x)) })),
      addStaff: (st) => {
        let err: string | undefined;
        setState((s) => {
          if (s.staff.some((x) => x.employeeId.toLowerCase() === st.employeeId.toLowerCase())) {
            err = "Duplicate employee ID";
            return s;
          }
          return { ...s, staff: [st, ...s.staff] };
        });
        return err ? { ok: false, error: err } : { ok: true };
      },
      updateStaff: (id, patch) =>
        setState((s) => ({ ...s, staff: s.staff.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      addClass: (name) => {
        let err: string | undefined;
        setState((s) => {
          if (s.classes.some((c) => c.name.toLowerCase() === name.toLowerCase() && c.academicYear === s.academicYear)) {
            err = "Class already exists for this academic year";
            return s;
          }
          const nc: SchoolClass = { id: `c-${Date.now()}`, name, academicYear: s.academicYear, status: "active" };
          return { ...s, classes: [...s.classes, nc] };
        });
        return err ? { ok: false, error: err } : { ok: true };
      },
      addSection: (classId, name) => {
        let err: string | undefined;
        setState((s) => {
          if (s.sections.some((x) => x.classId === classId && x.name.toLowerCase() === name.toLowerCase())) {
            err = "Section already exists in this class";
            return s;
          }
          const ns: Section = { id: `s-${Date.now()}`, classId, name: name.toUpperCase() };
          return { ...s, sections: [...s.sections, ns] };
        });
        return err ? { ok: false, error: err } : { ok: true };
      },
      assignTeacher: (sectionId, teacherId) =>
        setState((s) => ({ ...s, sections: s.sections.map((x) => (x.id === sectionId ? { ...x, teacherId } : x)) })),
      saveAttendance: (sess) =>
        setState((s) => {
          const idx = s.sessions.findIndex(
            (x) => x.date === sess.date && x.classId === sess.classId && x.sectionId === sess.sectionId
          );
          const next = [...s.sessions];
          if (idx >= 0) next[idx] = sess;
          else next.push(sess);
          return { ...s, sessions: next };
        }),
      getSession: (date, classId, sectionId) =>
        state.sessions.find((x) => x.date === date && x.classId === classId && x.sectionId === sectionId),
      addPayment: (p, chargeUpdates) =>
        setState((s) => ({
          ...s,
          payments: [p, ...s.payments],
          charges: chargeUpdates
            ? s.charges.map((c) => {
                const u = chargeUpdates.find((x) => x.id === c.id);
                return u ? { ...c, paidAmount: u.paidAmount, status: u.status } : c;
              })
            : s.charges,
        })),
      upsertFeeStructure: (fs) =>
        setState((s) => {
          const idx = s.feeStructures.findIndex((x) => x.academicYear === fs.academicYear && x.classId === fs.classId);
          if (idx >= 0) {
            const next = [...s.feeStructures];
            next[idx] = fs;
            return { ...s, feeStructures: next };
          }
          return { ...s, feeStructures: [...s.feeStructures, fs] };
        }),
      addAnnouncement: (a) => setState((s) => ({ ...s, announcements: [a, ...s.announcements] })),
      updateAnnouncement: (id, patch) =>
        setState((s) => ({ ...s, announcements: s.announcements.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      inviteUser: (u) => setState((s) => ({ ...s, users: [u, ...s.users] })),
      updateUserStatus: (id, status) =>
        setState((s) => ({ ...s, users: s.users.map((x) => (x.id === id ? { ...x, status } : x)) })),
      updateSchool: (patch) => setState((s) => ({ ...s, school: { ...s.school, ...patch } })),
      updatePlatformSchool: (id, patch) =>
        setState((s) => ({ ...s, platformSchools: s.platformSchools.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      addPlatformSchool: (sc) => setState((s) => ({ ...s, platformSchools: [sc, ...s.platformSchools] })),
      resetDemo: () => {
        try {
          localStorage.removeItem(KEY);
        } catch { /* noop */ }
        setState({ ...seedState(), hydrated: true, toasts: [] });
      },
    }),
    [state, toast, dismissToast]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore(): StoreApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}

export { currentUser };
