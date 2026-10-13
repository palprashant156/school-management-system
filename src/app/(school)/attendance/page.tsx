"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCheck, RotateCcw, Save, History } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Input, Select, Avatar } from "@/components/ui/ui";
import { PageHeader, SearchInput, StatusBadge, EmptyState, TableShell, Th, Td, TableSkeleton, DemoNote } from "@/components/shared/shared";
import type { AttendanceStatus } from "@/types";

const STATUSES: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export default function AttendancePage() {
  const { classes, sections, students, hydrated, saveAttendance, getSession, sessions, toast } = useStore();
  const [date, setDate] = useState("2025-10-13");
  const [today, setToday] = useState("2025-10-13");
  const [classId, setClassId] = useState("c-5");
  const [sectionId, setSectionId] = useState("s-5a");
  const [q, setQ] = useState("");
  const [marks, setMarks] = useState<Record<string, { status: AttendanceStatus; remarks?: string }>>({});
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const iso = new Date().toISOString().slice(0, 10);
    setDate(iso);
    setToday(iso);
  }, []);

  const classSections = useMemo(() => sections.filter((s) => s.classId === classId), [sections, classId]);
  const activeSectionId = classSections.some((s) => s.id === sectionId)
    ? sectionId
    : (classSections[0]?.id ?? sectionId);

  const roster = useMemo(() => {
    const n = q.trim().toLowerCase();
    return students
      .filter((s) => s.classId === classId && s.sectionId === activeSectionId && s.status === "active")
      .filter((s) => !n || `${s.firstName} ${s.lastName}`.toLowerCase().includes(n) || s.admissionNumber.toLowerCase().includes(n));
  }, [students, classId, activeSectionId, q]);

  // Load saved session when selectors change (syncs editable form state from local store)
  useEffect(() => {
    const sess = sessions.find((x) => x.date === date && x.classId === classId && x.sectionId === activeSectionId);
    if (sess) {
      const m: typeof marks = {};
      sess.records.forEach((r) => { m[r.studentId] = { status: r.status as AttendanceStatus, remarks: r.remarks }; });
      setMarks(m);
    } else {
      setMarks({});
    }
  }, [date, classId, activeSectionId, sessions]);

  const counts = useMemo(() => {
    let present = 0, absent = 0, late = 0, excused = 0, unmarked = 0;
    roster.forEach((s) => {
      const m = marks[s.id]?.status;
      if (!m || m === "unmarked") unmarked++;
      else if (m === "present") present++;
      else if (m === "absent") absent++;
      else if (m === "late") late++;
      else if (m === "excused") excused++;
    });
    return { present, absent, late, excused, unmarked, total: roster.length };
  }, [marks, roster]);

  const dirty = useMemo(() => {
    const sess = getSession(date, classId, activeSectionId);
    if (!sess && Object.keys(marks).length === 0) return false;
    if (!sess) return Object.keys(marks).length > 0;
    return JSON.stringify(sess.records) !== JSON.stringify(Object.entries(marks).map(([studentId, v]) => ({ studentId, status: v.status, remarks: v.remarks })));
  }, [marks, date, classId, activeSectionId, getSession]);

  useEffect(() => {
    function onUnload(e: BeforeUnloadEvent) {
      if (dirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  if (!hydrated) return <TableSkeleton />;

  function setStatus(id: string, status: AttendanceStatus) {
    setMarks((m) => ({ ...m, [id]: { status, remarks: m[id]?.remarks } }));
  }

  function markAll() {
    const m: typeof marks = {};
    roster.forEach((s) => { m[s.id] = { status: "present" }; });
    setMarks(m);
  }

  function save() {
    saveAttendance({
      id: `${date}-${classId}-${activeSectionId}`,
      date, classId, sectionId: activeSectionId,
      records: roster.map((s) => ({ studentId: s.id, status: marks[s.id]?.status ?? "unmarked", remarks: marks[s.id]?.remarks })),
      savedAt: new Date().toISOString(),
    });
    toast({ kind: "success", title: "Attendance saved", desc: `${formatDate(date)} · ${counts.present} present of ${counts.total} (demo).` });
  }

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle={`Daily marking · ${formatDate(date, "EEEE, dd MMM yyyy")}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setShowHistory((v) => !v)}><History className="h-4 w-4" /> History</Button>
            <Button variant="outline" onClick={markAll}><CheckCheck className="h-4 w-4" /> Mark all present</Button>
            <Button onClick={save} disabled={!dirty && !!getSession(date, classId, activeSectionId)}><Save className="h-4 w-4" /> Save attendance</Button>
          </>
        }
      />

      {dirty && (
        <p className="mb-3 text-[13px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          You have unsaved changes. Save before switching date or class.
        </p>
      )}

      <Card className="mb-4">
        <CardContent className="pt-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div><label className="text-xs font-medium text-slate-600" htmlFor="ad">Date</label><Input id="ad" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} /></div>
          <div>
            <label className="text-xs font-medium text-slate-600" htmlFor="ac">Class</label>
            <Select id="ac" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600" htmlFor="as">Section</label>
            <Select id="as" value={activeSectionId} onChange={(e) => setSectionId(e.target.value)}>
              {classSections.map((s) => <option key={s.id} value={s.id}>Section {s.name}</option>)}
            </Select>
          </div>
          <div className="col-span-2"><label className="text-xs font-medium text-slate-600" htmlFor="aq">Search</label><SearchInput value={q} onChange={setQ} placeholder="Search student…" /></div>
        </CardContent>
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {[
            [`Total ${counts.total}`, "bg-slate-100 text-slate-700 border-slate-200"],
            [`Present ${counts.present}`, "bg-emerald-50 text-emerald-700 border-emerald-200"],
            [`Absent ${counts.absent}`, "bg-red-50 text-red-700 border-red-200"],
            [`Late ${counts.late} · Excused ${counts.excused}`, "bg-amber-50 text-amber-800 border-amber-200"],
            [`Not marked ${counts.unmarked}`, "bg-white text-slate-600 border-dashed border-slate-300"],
          ].map(([t, cls]) => (
            <span key={t} className={`text-xs font-medium border rounded-full px-2.5 py-1 ${cls}`}>{t}</span>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setMarks({})} className="ml-auto"><RotateCcw className="h-3.5 w-3.5" /> Reset unsaved</Button>
        </div>
      </Card>

      {showHistory && (
        <Card className="mb-4">
          <CardHeader><CardTitle>Saved sessions</CardTitle><CardDesc>Local demo sessions for this browser</CardDesc></CardHeader>
          <CardContent>
            {sessions.length === 0 ? <p className="text-sm text-slate-500">No saved sessions yet.</p> : (
              <ul className="space-y-1.5 text-sm">
                {sessions.slice().reverse().slice(0, 8).map((s) => (
                  <li key={s.id} className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span>{formatDate(s.date)} · {s.classId} / {s.sectionId}</span>
                    <span className="text-slate-500">{s.records.filter((r) => r.status === "present").length}/{s.records.length} present</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        {roster.length === 0 ? <EmptyState title="No students in this section" desc="Try another class/section or clear search." /> : (
          <TableShell>
            <thead><tr><Th>Student</Th><Th>Admission No.</Th><Th>Status</Th><Th>Quick mark</Th><Th>Remarks</Th></tr></thead>
            <tbody>
              {roster.map((s) => {
                const cur = marks[s.id]?.status ?? "unmarked";
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <Td><span className="flex items-center gap-2"><Avatar name={`${s.firstName} ${s.lastName}`} className="h-8 w-8 text-xs" /><span className="font-medium">{s.firstName} {s.lastName}</span></span></Td>
                    <Td className="tabular-nums">{s.admissionNumber}</Td>
                    <Td><StatusBadge status={cur} /></Td>
                    <Td>
                      <span className="flex gap-1" role="radiogroup" aria-label={`Attendance for ${s.firstName}`}>
                        {STATUSES.map((st) => (
                          <button
                            key={st}
                            role="radio"
                            aria-checked={cur === st}
                            title={st}
                            onClick={() => setStatus(s.id, st)}
                            className={`h-7 px-2 rounded-md text-xs font-medium border ${cur === st ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
                          >
                            {st[0].toUpperCase()}
                          </button>
                        ))}
                      </span>
                      <span className="sr-only">{cur}</span>
                    </Td>
                    <Td>
                      <Input
                        aria-label={`Remarks for ${s.firstName}`}
                        placeholder="Optional"
                        value={marks[s.id]?.remarks ?? ""}
                        onChange={(e) => setMarks((m) => ({ ...m, [s.id]: { status: m[s.id]?.status ?? "unmarked", remarks: e.target.value } }))}
                        className="h-8 max-w-[180px]"
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
        <div className="p-4"><DemoNote text="Unmarked ≠ Absent. Only saved sessions count in history. Data stays in this browser." /></div>
      </Card>
    </div>
  );
}
