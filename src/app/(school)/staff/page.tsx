"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { className } from "@/data/seed";
import { formatDate } from "@/lib/formatters";
import { Button, Card, Input, Label, Select, Dialog, FieldError, Avatar } from "@/components/ui/ui";
import { PageHeader, SearchInput, StatusBadge, EmptyState, TableShell, Th, Td, TableSkeleton, DemoNote } from "@/components/shared/shared";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  employeeId: z.string().min(3, "Employee ID required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Phone required"),
  designation: z.string().min(2, "Designation required"),
  joiningDate: z.string().min(1, "Joining date required"),
  status: z.enum(["active", "on-leave", "resigned"]),
});

type V = z.infer<typeof schema>;

export default function StaffPage() {
  const { staff, hydrated, addStaff, updateStaff, toast } = useStore();
  const [q, setQ] = useState("");
  const [desig, setDesig] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { status: "active", joiningDate: "2025-10-13", designation: "Primary Teacher" },
  });

  useEffect(() => {
    if (open && !editId) {
      reset({ status: "active", joiningDate: new Date().toISOString().slice(0, 10), designation: "Primary Teacher", name: "", employeeId: "", email: "", phone: "" });
    }
  }, [open, editId, reset]);

  const designations = useMemo(() => Array.from(new Set(staff.map((s) => s.designation))), [staff]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return staff.filter((s) =>
      (!n || s.name.toLowerCase().includes(n) || s.employeeId.toLowerCase().includes(n)) &&
      (desig === "all" || s.designation === desig) &&
      (status === "all" || s.status === status)
    );
  }, [staff, q, desig, status]);

  function openAdd() {
    setEditId(null);
    reset({ status: "active", joiningDate: "2025-10-13", designation: "Primary Teacher", name: "", employeeId: "", email: "", phone: "" });
    setOpen(true);
  }
  function openEdit(id: string) {
    const s = staff.find((x) => x.id === id);
    if (!s) return;
    setEditId(id);
    setValue("name", s.name); setValue("employeeId", s.employeeId); setValue("email", s.email);
    setValue("phone", s.phone); setValue("designation", s.designation); setValue("joiningDate", s.joiningDate); setValue("status", s.status);
    setOpen(true);
  }

  function onSubmit(v: V) {
    if (editId) {
      updateStaff(editId, v);
      toast({ kind: "success", title: "Staff updated" });
    } else {
      const res = addStaff({ id: `st-${Date.now()}`, classIds: [], ...v });
      if (!res.ok) {
        toast({ kind: "error", title: "Duplicate employee ID" });
        return;
      }
      toast({ kind: "success", title: "Staff added", desc: `${v.name} added to directory.` });
    }
    setOpen(false);
  }

  if (!hydrated) return <TableSkeleton />;

  return (
    <div>
      <PageHeader title="Staff" subtitle={`${filtered.length} team members`} actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Staff</Button>} />
      <Card>
        <div className="p-4 flex flex-col lg:flex-row gap-3">
          <SearchInput value={q} onChange={setQ} placeholder="Search name or employee ID…" className="lg:max-w-sm w-full" />
          <div className="flex gap-2">
            <Select aria-label="Designation" value={desig} onChange={(e) => setDesig(e.target.value)} className="sm:w-52">
              <option value="all">All designations</option>
              {designations.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
              <option value="all">All statuses</option>
              <option value="active">Active</option><option value="on-leave">On leave</option><option value="resigned">Resigned</option>
            </Select>
          </div>
        </div>
        {filtered.length === 0 ? <EmptyState title="No staff found" desc="Adjust filters or add a team member." /> : (
          <TableShell>
            <thead><tr><Th>Staff</Th><Th>Employee ID</Th><Th>Contact</Th><Th>Designation</Th><Th>Assigned</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <Td><span className="flex items-center gap-2.5"><Avatar name={s.name} className="h-8 w-8 text-xs" /><span className="font-medium">{s.name}<span className="block text-xs text-slate-500 font-normal">Joined {formatDate(s.joiningDate)}</span></span></span></Td>
                  <Td className="tabular-nums">{s.employeeId}</Td>
                  <Td className="text-[13px]">{s.email}<span className="block text-slate-500">{s.phone}</span></Td>
                  <Td>{s.designation}</Td>
                  <Td className="text-[13px]">{s.classIds.length ? s.classIds.map((c) => className(c)).join(", ") : "—"}</Td>
                  <Td><StatusBadge status={s.status} /></Td>
                  <Td className="text-right"><Button variant="ghost" size="sm" onClick={() => openEdit(s.id)}><Pencil className="h-3.5 w-3.5" /> Edit</Button></Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
        <div className="p-4"><DemoNote /></div>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editId ? "Edit staff" : "Add staff"} desc="Demo directory — stored locally" wide>
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
          <div><Label htmlFor="sn">Full name *</Label><Input id="sn" {...register("name")} /><FieldError message={errors.name?.message} /></div>
          <div><Label htmlFor="se">Employee ID *</Label><Input id="se" {...register("employeeId")} /><FieldError message={errors.employeeId?.message} /></div>
          <div><Label htmlFor="sem">Email *</Label><Input id="sem" {...register("email")} /><FieldError message={errors.email?.message} /></div>
          <div><Label htmlFor="sp">Phone *</Label><Input id="sp" {...register("phone")} /><FieldError message={errors.phone?.message} /></div>
          <div><Label htmlFor="sd">Designation *</Label><Input id="sd" {...register("designation")} list="desigs" /><datalist id="desigs">{designations.map((d) => <option key={d} value={d} />)}</datalist><FieldError message={errors.designation?.message} /></div>
          <div><Label htmlFor="sj">Joining date *</Label><Input id="sj" type="date" {...register("joiningDate")} /><FieldError message={errors.joiningDate?.message} /></div>
          <div>
            <Label htmlFor="ss">Status</Label>
            <Select id="ss" {...register("status")}><option value="active">Active</option><option value="on-leave">On leave</option><option value="resigned">Resigned</option></Select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editId ? "Save changes" : "Add staff"}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
