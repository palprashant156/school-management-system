"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc, Input, Label, Select, Dialog, FieldError } from "@/components/ui/ui";
import { PageHeader, EmptyState, TableSkeleton, DemoNote } from "@/components/shared/shared";

const classSchema = z.object({ name: z.string().min(2, "Class name required, e.g. Class 11") });
const sectionSchema = z.object({ classId: z.string().min(1, "Select class"), name: z.string().min(1, "Section name required").max(2, "Use 1–2 letters") });

export default function ClassesPage() {
  const { classes, sections, students, staff, hydrated, addClass, addSection, assignTeacher, toast } = useStore();
  const [classOpen, setClassOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);
  const [assignSec, setAssignSec] = useState<string | null>(null);
  const [teacher, setTeacher] = useState("");

  const cf = useForm<z.infer<typeof classSchema>>({ resolver: zodResolver(classSchema) });
  const sf = useForm<z.infer<typeof sectionSchema>>({ resolver: zodResolver(sectionSchema) });

  if (!hydrated) return <TableSkeleton />;

  function studentsIn(sectionId: string) {
    return students.filter((s) => s.sectionId === sectionId).length;
  }

  return (
    <div>
      <PageHeader
        title="Classes & Sections"
        subtitle="Academic year → class → section → enrollment"
        actions={<><Button variant="outline" onClick={() => setSecOpen(true)}><Plus className="h-4 w-4" /> Section</Button><Button onClick={() => setClassOpen(true)}><Plus className="h-4 w-4" /> Class</Button></>}
      />

      {classes.length === 0 ? <Card><EmptyState title="No classes yet" desc="Create your first class to get started." /></Card> : (
        <div className="grid md:grid-cols-2 gap-4">
          {classes.map((c) => {
            const secs = sections.filter((s) => s.classId === c.id);
            const total = secs.reduce((a, s) => a + studentsIn(s.id), 0);
            return (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div><CardTitle>{c.name}</CardTitle><CardDesc>{secs.length} sections · {total} students · {c.academicYear}</CardDesc></div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{c.status}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {secs.length === 0 && <p className="text-[13px] text-slate-500">No sections yet.</p>}
                  {secs.map((s) => {
                    const t = staff.find((x) => x.id === s.teacherId);
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">{s.name}</span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium">{c.name} {s.name} · {studentsIn(s.id)} students</p>
                            <p className="text-xs text-slate-500 truncate">{t ? `Class teacher: ${t.name}` : "No teacher assigned"}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Link href={`/students?class=${c.id}`}><Button variant="ghost" size="sm"><Users className="h-3.5 w-3.5" /> View</Button></Link>
                          <Button variant="ghost" size="sm" onClick={() => { setAssignSec(s.id); setTeacher(s.teacherId ?? ""); }}><Pencil className="h-3.5 w-3.5" /> Teacher</Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <div className="mt-4"><DemoNote text="Demo hierarchy: duplicate class or section names are blocked in this school context." /></div>

      <Dialog open={classOpen} onClose={() => setClassOpen(false)} title="Create class" desc="Unique per academic year">
        <form onSubmit={cf.handleSubmit((v) => {
          const r = addClass(v.name.trim());
          if (!r.ok) { toast({ kind: "error", title: "Duplicate class", desc: r.error }); return; }
          toast({ kind: "success", title: "Class created" });
          cf.reset(); setClassOpen(false);
        })} className="space-y-3">
          <div><Label htmlFor="cn">Class name *</Label><Input id="cn" placeholder="Class 11" {...cf.register("name")} /><FieldError message={cf.formState.errors.name?.message} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setClassOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
        </form>
      </Dialog>

      <Dialog open={secOpen} onClose={() => setSecOpen(false)} title="Create section" desc="Unique per class">
        <form onSubmit={sf.handleSubmit((v) => {
          const r = addSection(v.classId, v.name.trim());
          if (!r.ok) { toast({ kind: "error", title: "Duplicate section", desc: r.error }); return; }
          toast({ kind: "success", title: "Section created" });
          sf.reset(); setSecOpen(false);
        })} className="space-y-3">
          <div>
            <Label htmlFor="sc">Class *</Label>
            <Select id="sc" {...sf.register("classId")} defaultValue="">
              <option value="" disabled>Select class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <FieldError message={sf.formState.errors.classId?.message} />
          </div>
          <div><Label htmlFor="sn2">Section *</Label><Input id="sn2" placeholder="C" {...sf.register("name")} /><FieldError message={sf.formState.errors.name?.message} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setSecOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
        </form>
      </Dialog>

      <Dialog open={!!assignSec} onClose={() => setAssignSec(null)} title="Assign teacher" desc="Choose from active staff (demo)">
        <div className="space-y-3">
          <Select aria-label="Teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            <option value="">No teacher</option>
            {staff.filter((s) => s.status === "active").map((s) => <option key={s.id} value={s.id}>{s.name} · {s.designation}</option>)}
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignSec(null)}>Cancel</Button>
            <Button onClick={() => { if (assignSec) { assignTeacher(assignSec, teacher); toast({ kind: "success", title: "Teacher assigned" }); } setAssignSec(null); }}>Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
