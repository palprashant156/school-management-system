"use client";

import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { className } from "@/data/seed";
import { formatINR, downloadCSV, formatNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Select } from "@/components/ui/ui";
import { PageHeader, KpiCard, TableSkeleton, DemoNote } from "@/components/shared/shared";

const REPORTS = [
  { id: "enrollment", label: "Student enrollment summary" },
  { id: "attendance", label: "Attendance summary" },
  { id: "collection", label: "Fee collection summary" },
  { id: "outstanding", label: "Outstanding fee report" },
  { id: "staff", label: "Staff directory report" },
];

export default function ReportsPage() {
  const { students, staff, payments, charges, classes, hydrated } = useStore();
  const [report, setReport] = useState("enrollment");
  const [classF, setClassF] = useState("all");
  const [year, setYear] = useState("2025-26");

  const rows = useMemo(() => {
    if (report === "enrollment") {
      return classes.map((c) => {
        const list = students.filter((s) => s.classId === c.id && (classF === "all" || c.id === classF));
        return { class: c.name, total: list.length, active: list.filter((s) => s.status === "active").length, pending: list.filter((s) => s.status === "pending").length };
      }).filter((r) => classF === "all" || r.total > 0);
    }
    if (report === "collection") {
      return payments.map((p) => ({ receipt: p.receiptNumber, student: p.studentId, date: p.date, amount: p.amount, method: p.method, status: p.status }));
    }
    if (report === "outstanding") {
      return charges.filter((c) => c.status !== "paid").map((c) => ({ student: c.studentId, category: c.category, amount: c.amount, paid: c.paidAmount, balance: c.amount - c.paidAmount, status: c.status }));
    }
    if (report === "staff") {
      return staff.map((s) => ({ name: s.name, id: s.employeeId, designation: s.designation, phone: s.phone, status: s.status }));
    }
    return [{ metric: "Present % (mock)", value: "92.4%" }, { metric: "Absent today (mock)", value: "48" }, { metric: "Sessions saved", value: "12" }];
  }, [report, students, payments, charges, staff, classes, classF]);

  if (!hydrated) return <TableSkeleton />;

  function exportCSV() {
    if (rows.length === 0) return;
    const mapped = rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v)])));
    downloadCSV(`${report}-${year}.csv`, mapped as Record<string, string>[]);
  }

  const collected = payments.filter((p) => p.status === "success").reduce((a, p) => a + p.amount, 0);
  const outstanding = charges.filter((c) => c.status !== "paid").reduce((a, c) => a + (c.amount - c.paidAmount), 0);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Demo data · filtered exports to CSV" actions={<Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4" /> Export CSV</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <KpiCard label="Students" value={formatNumber(students.length)} hint={year} />
        <KpiCard label="Collected (demo)" value={formatINR(collected)} hint="All receipts" />
        <KpiCard label="Outstanding" value={formatINR(outstanding)} hint="Open charges" />
      </div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-4">
        <Card>
          <CardContent className="pt-4 space-y-1">
            {REPORTS.map((r) => (
              <button
                key={r.id}
                onClick={() => setReport(r.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${report === r.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <FileText className="h-4 w-4" /> {r.label}
              </button>
            ))}
            <div className="pt-3 space-y-2">
              <Select aria-label="Academic year" value={year} onChange={(e) => setYear(e.target.value)}>
                <option>2024-25</option><option>2025-26</option><option>2026-27</option>
              </Select>
              <Select aria-label="Class filter" value={classF} onChange={(e) => setClassF(e.target.value)}>
                <option value="all">All classes</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{REPORTS.find((r) => r.id === report)?.label}</CardTitle><CardDesc>{rows.length} rows · {year}{classF !== "all" ? ` · ${className(classF)}` : ""}</CardDesc></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead><tr>{rows.length > 0 && Object.keys(rows[0]).map((k) => <th key={k} className="text-left text-xs uppercase text-slate-500 px-3 py-2 border-b border-slate-200">{k}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Object.values(r).map((v, j) => <td key={j} className="px-3 py-2">{String(v)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3"><DemoNote /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
