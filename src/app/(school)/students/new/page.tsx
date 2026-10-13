"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Input, Label, Select, Textarea, FieldError } from "@/components/ui/ui";
import { PageHeader } from "@/components/shared/shared";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Select gender"),
  admissionNumber: z.string().min(4, "Admission number is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  classId: z.string().min(1, "Select a class"),
  sectionId: z.string().min(1, "Select a section"),
  admissionDate: z.string().min(1, "Admission date is required"),
  status: z.enum(["active", "pending"]),
  guardianName: z.string().min(2, "Guardian name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().regex(/^\+91[\s\d]{8,14}$/, "Use format +91 XXXXX XXXXX"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  address: z.string().min(4, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "6-digit pincode"),
});

type FormValues = z.infer<typeof schema>;

export default function NewStudentPage() {
  const router = useRouter();
  const { classes, sections, academicYear, addStudent, toast, students } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      academicYear,
      admissionDate: "2025-10-13",
      status: "active",
      gender: "Female",
      relationship: "Father",
      city: "Bengaluru",
      state: "Karnataka",
    },
  });

  useEffect(() => {
    setValue("admissionDate", new Date().toISOString().slice(0, 10));
  }, [setValue]);

  const classId = watch("classId");
  const availSections = useMemo(() => sections.filter((s) => s.classId === classId), [sections, classId]);

  async function onSubmit(v: FormValues) {
    if (students.some((s) => s.admissionNumber.toLowerCase() === v.admissionNumber.toLowerCase())) {
      toast({ kind: "error", title: "Duplicate admission number", desc: "This admission number already exists in demo data." });
      return;
    }
    const id = `stu-${Date.now().toString().slice(-6)}`;
    const res = addStudent(
      {
        id,
        firstName: v.firstName,
        lastName: v.lastName,
        dob: v.dob,
        gender: v.gender,
        admissionNumber: v.admissionNumber,
        academicYear: v.academicYear,
        classId: v.classId,
        sectionId: v.sectionId,
        admissionDate: v.admissionDate,
        status: v.status,
        guardianIds: [`g-${id}`],
        address: v.address,
        city: v.city,
        state: v.state,
        pincode: v.pincode,
      },
      {
        id: `g-${id}`,
        studentId: id,
        name: v.guardianName,
        relationship: v.relationship,
        phone: v.phone,
        email: v.email,
        isPrimary: true,
      }
    );
    if (!res.ok) {
      toast({ kind: "error", title: "Could not save", desc: res.error });
      return;
    }
    toast({ kind: "success", title: "Student added", desc: `${v.firstName} ${v.lastName} saved to demo data.` });
    router.push(`/students/${id}`);
  }

  const F = ({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div>
      <Label htmlFor={id}>{label} {required && <span className="text-red-600">*</span>}</Label>
      {children}
      <FieldError message={error} />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <PageHeader title="Add Student" subtitle="Demo form — saved to browser-local mock data" breadcrumb="Students / New" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Personal information</CardTitle><CardDesc>Name, birth details and photo placeholder</CardDesc></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <F id="firstName" label="First name" required error={errors.firstName?.message}>
              <Input id="firstName" {...register("firstName")} placeholder="Aarav" />
            </F>
            <F id="lastName" label="Last name" required error={errors.lastName?.message}>
              <Input id="lastName" {...register("lastName")} placeholder="Sharma" />
            </F>
            <F id="dob" label="Date of birth" required error={errors.dob?.message}>
              <Input id="dob" type="date" {...register("dob")} />
            </F>
            <F id="gender" label="Gender" required error={errors.gender?.message}>
              <Select id="gender" {...register("gender")}>
                <option>Female</option><option>Male</option><option>Other</option>
              </Select>
            </F>
            <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
              <span className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">—</span>
              <p className="text-[13px] text-slate-500">Photo upload is a placeholder in this demo. Avatar initials are used across the app.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Enrollment information</CardTitle><CardDesc>Admission number must be unique</CardDesc></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <F id="admissionNumber" label="Admission number" required error={errors.admissionNumber?.message}>
              <Input id="admissionNumber" {...register("admissionNumber")} placeholder="VVPS-2025-1042" />
            </F>
            <F id="academicYear" label="Academic year" required error={errors.academicYear?.message}>
              <Select id="academicYear" {...register("academicYear")}>
                <option>2024-25</option><option>2025-26</option><option>2026-27</option>
              </Select>
            </F>
            <F id="classId" label="Class" required error={errors.classId?.message}>
              <Select id="classId" {...register("classId")} defaultValue="">
                <option value="" disabled>Select class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </F>
            <F id="sectionId" label="Section" required error={errors.sectionId?.message}>
              <Select id="sectionId" {...register("sectionId")} defaultValue="">
                <option value="" disabled>{classId ? "Select section" : "Select class first"}</option>
                {availSections.map((s) => <option key={s.id} value={s.id}>Section {s.name}</option>)}
              </Select>
            </F>
            <F id="admissionDate" label="Admission date" required error={errors.admissionDate?.message}>
              <Input id="admissionDate" type="date" {...register("admissionDate")} />
            </F>
            <F id="status" label="Enrollment status" required error={errors.status?.message}>
              <Select id="status" {...register("status")}>
                <option value="active">Active</option><option value="pending">Pending</option>
              </Select>
            </F>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Guardian information</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <F id="guardianName" label="Guardian name" required error={errors.guardianName?.message}>
              <Input id="guardianName" {...register("guardianName")} placeholder="Rajesh Sharma" />
            </F>
            <F id="relationship" label="Relationship" required error={errors.relationship?.message}>
              <Select id="relationship" {...register("relationship")}>
                <option>Father</option><option>Mother</option><option>Guardian</option><option>Other</option>
              </Select>
            </F>
            <F id="phone" label="Phone" required error={errors.phone?.message}>
              <Input id="phone" {...register("phone")} placeholder="+91 98450 12345" />
            </F>
            <F id="email" label="Email" error={errors.email?.message}>
              <Input id="email" {...register("email")} placeholder="guardian@example.in" />
            </F>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Address</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <F id="address" label="Address" required error={errors.address?.message}>
                <Textarea id="address" {...register("address")} placeholder="Flat, street, area" />
              </F>
            </div>
            <F id="city" label="City" required error={errors.city?.message}>
              <Input id="city" {...register("city")} />
            </F>
            <F id="state" label="State" required error={errors.state?.message}>
              <Input id="state" {...register("state")} />
            </F>
            <div className="sm:col-span-2 sm:max-w-[240px]">
              <F id="pincode" label="Postal code" required error={errors.pincode?.message}>
                <Input id="pincode" {...register("pincode")} placeholder="560102" inputMode="numeric" />
              </F>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end sticky bottom-4 bg-slate-50/90 backdrop-blur py-2">
          <Button type="button" variant="outline" onClick={() => router.push("/students")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save student"}</Button>
        </div>
      </form>
    </div>
  );
}
