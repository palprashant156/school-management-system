"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, MoreHorizontal, Eye, Pencil, UserX } from "lucide-react";
import { useStore } from "@/lib/store";
import { sectionName } from "@/data/seed";
import { Button, Card, Select, Avatar } from "@/components/ui/ui";
import { PageHeader, SearchInput, StatusBadge, Pagination, EmptyState, TableShell, Th, Td, TableSkeleton, ConfirmDialog } from "@/components/shared/shared";

export default function StudentsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentsContent />
    </Suspense>
  );
}

function StudentsContent() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const { students, guardians, classes, hydrated, changeStudentStatus, toast } = useStore();

  const [q, setQ] = useState(initialQ);
  const [classF, setClassF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [sort, setSort] = useState<"name" | "admission">("name");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...students];
    if (needle) {
      list = list.filter((s) => {
        const g = guardians.find((x) => x.studentId === s.id);
        return (
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(needle) ||
          s.admissionNumber.toLowerCase().includes(needle) ||
          (g?.phone ?? "").toLowerCase().includes(needle)
        );
      });
    }
    if (classF !== "all") list = list.filter((s) => s.classId === classF);
    if (statusF !== "all") list = list.filter((s) => s.status === statusF);
    list.sort((a, b) =>
      sort === "name" ? `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) : a.admissionNumber.localeCompare(b.admissionNumber)
    );
    return list;
  }, [students, guardians, q, classF, statusF, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (!hydrated) return <TableSkeleton />;

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} students · Academic year 2025-26`}
        actions={<Link href="/students/new"><Button><Plus className="h-4 w-4" /> Add Student</Button></Link>}
      />

      <Card>
        <div className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
          <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search name, admission no., guardian phone…" className="lg:max-w-sm w-full" />
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select aria-label="Filter by class" value={classF} onChange={(e) => { setClassF(e.target.value); setPage(1); }} className="sm:w-44">
              <option value="all">All classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select aria-label="Filter by status" value={statusF} onChange={(e) => { setStatusF(e.target.value); setPage(1); }} className="sm:w-40">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="alumni">Alumni</option>
            </Select>
            <Select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="sm:w-40">
              <option value="name">Sort: Name</option>
              <option value="admission">Sort: Admission no.</option>
            </Select>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="No students found"
            desc="Try adjusting search or filters, or add a new student."
            action={<Link href="/students/new"><Button><Plus className="h-4 w-4" /> Add Student</Button></Link>}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Student</Th>
                  <Th>Admission No.</Th>
                  <Th>Class & Section</Th>
                  <Th>Guardian</Th>
                  <Th>Contact</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const g = guardians.find((x) => x.studentId === s.id);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <Td>
                        <span className="flex items-center gap-2.5">
                          <Avatar name={`${s.firstName} ${s.lastName}`} className="h-8 w-8 text-xs" />
                          <span>
                            <Link href={`/students/${s.id}`} className="font-medium text-slate-900 hover:text-indigo-700 block">
                              {s.firstName} {s.lastName}
                            </Link>
                            <span className="text-xs text-slate-500">{s.gender} · {s.id}</span>
                          </span>
                        </span>
                      </Td>
                      <Td className="tabular-nums">{s.admissionNumber}</Td>
                      <Td>{sectionName(s.sectionId)}</Td>
                      <Td>{g?.name ?? "—"} <span className="text-xs text-slate-400 block">{g?.relationship}</span></Td>
                      <Td className="tabular-nums text-[13px]">{g?.phone ?? "—"}</Td>
                      <Td><StatusBadge status={s.status} /></Td>
                      <Td className="text-right">
                        <span className="relative inline-block">
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${s.firstName}`} onClick={() => setMenuId(menuId === s.id ? null : s.id)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {menuId === s.id && (
                            <>
                              <button aria-label="Close" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuId(null)} />
                              <span className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 text-left">
                                <Link href={`/students/${s.id}`} className="flex items-center gap-2 px-3 py-2 text-[13px] hover:bg-slate-50 rounded-lg" onClick={() => setMenuId(null)}>
                                  <Eye className="h-3.5 w-3.5" /> View Profile
                                </Link>
                                <Link href={`/students/${s.id}?edit=1`} className="flex items-center gap-2 px-3 py-2 text-[13px] hover:bg-slate-50 rounded-lg" onClick={() => setMenuId(null)}>
                                  <Pencil className="h-3.5 w-3.5" /> Edit Student
                                </Link>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-700 hover:bg-red-50 rounded-lg" onClick={() => { setMenuId(null); setConfirmId(s.id); }}>
                                  <UserX className="h-3.5 w-3.5" /> Change Status
                                </button>
                              </span>
                            </>
                          )}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableShell>
            <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPage={setPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Change enrollment status"
        desc="Mark this student inactive? They will be hidden from attendance and fee lists. You can reactivate later."
        confirmLabel="Mark inactive"
        danger
        onConfirm={() => {
          if (confirmId) {
            changeStudentStatus(confirmId, "inactive");
            toast({ kind: "success", title: "Status updated", desc: "Student marked inactive (demo)." });
          }
        }}
      />
    </div>
  );
}
