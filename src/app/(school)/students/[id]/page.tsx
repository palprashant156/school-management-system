"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import type { Student } from "@/types";
import { useStore } from "@/lib/store";
import { sectionName } from "@/data/seed";
import { formatINR, formatDate } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Avatar, Tabs, Input, Label, Select, Badge } from "@/components/ui/ui";
import { PageHeader, StatusBadge, EmptyState, Currency } from "@/components/shared/shared";

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <StudentProfileContent />
    </Suspense>
  );
}

function StudentProfileContent() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { students, guardians, charges, payments, sessions, hydrated, updateStudent, toast } = useStore();
  const [tab, setTab] = useState("overview");
  const [editing, setEditing] = useState(search.get("edit") === "1");
  const [form, setForm] = useState({ firstName: "", lastName: "", status: "active" as string });

  const student = students.find((s) => s.id === params.id);
  const guardian = guardians.find((g) => g.studentId === params.id);

  const myCharges = useMemo(() => charges.filter((c) => c.studentId === params.id), [charges, params.id]);
  const myPayments = useMemo(() => payments.filter((p) => p.studentId === params.id), [payments, params.id]);
  const myAttendance = useMemo(() => {
    const recs: { date: string; status: string; classId: string }[] = [];
    sessions.forEach((sess) => {
      const r = sess.records.find((x) => x.studentId === params.id);
      if (r) recs.push({ date: sess.date, status: r.status, classId: sess.classId });
    });
    return recs.slice(0, 10);
  }, [sessions, params.id]);

  if (!hydrated) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!student) {
    return (
      <div>
        <PageHeader title="Student not found" subtitle="This record does not exist in demo data." />
        <Card><EmptyState title="Invalid student ID" desc="The link may be broken or the record was removed. Reset demo data to restore." action={<Link href="/students"><Button>Back to students</Button></Link>} /></Card>
      </div>
    );
  }

  const outstanding = myCharges.reduce((a, c) => a + (c.amount - c.paidAmount), 0);

  function startEdit() {
    setForm({ firstName: student!.firstName, lastName: student!.lastName, status: student!.status });
    setEditing(true);
  }

  function saveEdit() {
    if (!student) return;
    updateStudent(student.id, { firstName: form.firstName, lastName: form.lastName, status: form.status as Student["status"] });
    setEditing(false);
    toast({ kind: "success", title: "Student updated", desc: "Changes saved to demo data." });
    router.replace(`/students/${student.id}`);
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.push("/students")} className="mb-3"><ArrowLeft className="h-4 w-4" /> All students</Button>
      <Card className="mb-4">
        <CardContent className="pt-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar name={`${student.firstName} ${student.lastName}`} className="h-14 w-14 text-lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold">{student.firstName} {student.lastName}</h1>
            <p className="text-sm text-slate-500">{student.admissionNumber} · {sectionName(student.sectionId)} · Admitted {formatDate(student.admissionDate)}</p>
            <div className="mt-2 flex gap-2"><StatusBadge status={student.status} /><Badge tone="slate">{student.academicYear}</Badge></div>
          </div>
          <Button variant="outline" onClick={startEdit}><Pencil className="h-4 w-4" /> Edit</Button>
        </CardContent>
      </Card>

      {editing && (
        <Card className="mb-4 border-indigo-200">
          <CardHeader><CardTitle>Edit student (demo)</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-3">
            <div><Label htmlFor="ef">First name</Label><Input id="ef" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div><Label htmlFor="el">Last name</Label><Input id="el" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
            <div>
              <Label htmlFor="es">Status</Label>
              <Select id="es" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option><option value="alumni">Alumni</option>
              </Select>
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={saveEdit}>Save changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs tabs={[
        { id: "overview", label: "Overview" },
        { id: "guardian", label: "Guardian Details" },
        { id: "attendance", label: "Attendance" },
        { id: "fees", label: "Fees" },
        { id: "documents", label: "Documents" },
      ]} value={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === "overview" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle>Personal</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1.5">
                <p><span className="text-slate-500">DOB:</span> {formatDate(student.dob)}</p>
                <p><span className="text-slate-500">Gender:</span> {student.gender}</p>
                <p><span className="text-slate-500">Address:</span> {student.address}, {student.city}, {student.state} {student.pincode}</p>
              </CardContent></Card>
            <Card><CardHeader><CardTitle>Fee summary</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1.5">
                <p><span className="text-slate-500">Outstanding:</span> <Currency amount={outstanding} /></p>
                <p><span className="text-slate-500">Charges:</span> {myCharges.length} · <span className="text-slate-500">Payments:</span> {myPayments.length}</p>
                <Link href="/fees"><Button variant="outline" size="sm" className="mt-2">Record payment</Button></Link>
              </CardContent></Card>
          </div>
        )}
        {tab === "guardian" && (
          <Card><CardHeader><CardTitle>Guardian details</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1.5">
              {guardian ? (
                <>
                  <p className="font-medium">{guardian.name} · {guardian.relationship} {guardian.isPrimary && <Badge tone="indigo">Primary</Badge>}</p>
                  <p><span className="text-slate-500">Phone:</span> {guardian.phone}</p>
                  <p><span className="text-slate-500">Email:</span> {guardian.email}</p>
                </>
              ) : <EmptyState title="No guardian on file" desc="Add guardian details via Edit." />}
            </CardContent></Card>
        )}
        {tab === "attendance" && (
          <Card><CardHeader><CardTitle>Recent attendance</CardTitle></CardHeader>
            <CardContent>
              {myAttendance.length === 0 ? <EmptyState title="No attendance yet" desc="Mark attendance for this student's class to see records here." action={<Link href="/attendance"><Button variant="outline">Open attendance</Button></Link>} /> : (
                <ul className="space-y-2">
                  {myAttendance.map((a, i) => (
                    <li key={i} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                      <span>{formatDate(a.date)}</span><StatusBadge status={a.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent></Card>
        )}
        {tab === "fees" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle>Charges</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {myCharges.length === 0 && <p className="text-slate-500">No charges.</p>}
                {myCharges.map((c) => (
                  <div key={c.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                    <span>{c.category} <span className="text-xs text-slate-400">due {formatDate(c.dueDate)}</span><br /><StatusBadge status={c.status} /></span>
                    <span className="text-right"><Currency amount={c.amount} /><span className="block text-xs text-slate-500">paid {formatINR(c.paidAmount)}</span></span>
                  </div>
                ))}
              </CardContent></Card>
            <Card><CardHeader><CardTitle>Payments</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {myPayments.length === 0 && <p className="text-slate-500">No payments.</p>}
                {myPayments.map((p) => (
                  <div key={p.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                    <span>{p.receiptNumber}<br /><span className="text-xs text-slate-500">{formatDate(p.date)} · {p.method}</span></span>
                    <span><Currency amount={p.amount} /></span>
                  </div>
                ))}
              </CardContent></Card>
          </div>
        )}
        {tab === "documents" && (
          <Card><CardContent><EmptyState title="No documents" desc="Birth certificate, transfer certificate and photos would appear here in the full product." /></CardContent></Card>
        )}
      </div>
    </div>
  );
}
