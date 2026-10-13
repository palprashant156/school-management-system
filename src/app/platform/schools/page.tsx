"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { plans } from "@/data/seed";
import { formatDate } from "@/lib/formatters";
import { Button, Card, Input, Label, Select, Dialog, FieldError } from "@/components/ui/ui";
import { PageHeader, SearchInput, StatusBadge, EmptyState, TableShell, Th, Td, TableSkeleton } from "@/components/shared/shared";

const schema = z.object({
  name: z.string().min(3, "School name required"),
  city: z.string().min(2, "City required"),
  planId: z.string().min(1, "Select plan"),
});

export default function PlatformSchools() {
  const { platformSchools, hydrated, updatePlatformSchool, addPlatformSchool, toast } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { planId: "plan-starter" },
  });

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return platformSchools.filter((s) =>
      (!n || s.name.toLowerCase().includes(n) || s.location.toLowerCase().includes(n)) &&
      (status === "all" || s.status === status)
    );
  }, [platformSchools, q, status]);

  if (!hydrated) return <TableSkeleton />;

  const studentCounts: Record<string, number> = { "sch-001": 1240, "sch-002": 860, "sch-003": 3120, "sch-004": 320, "sch-005": 410, "sch-006": 640 };

  // Event handler: impure ids generated on submit, not during render
  function onCreate(v: z.infer<typeof schema>) {
    addPlatformSchool({
      id: `sch-${Date.now()}`,
      code: `DEMO-${Math.floor(Math.random() * 9000 + 1000)}`,
      address: "Demo address", state: "Karnataka", pincode: "560001",
      phone: "+91 80 0000 0000", email: "demo@example.in",
      academicYear: "2025-26", timezone: "Asia/Kolkata", currency: "INR",
      status: "trial", location: `${v.city}, India`, joinedDate: new Date().toISOString().slice(0, 10),
      entitlements: ["students", "attendance", "reports"],
      name: v.name, city: v.city, planId: v.planId,
    });
    toast({ kind: "success", title: "Demo school created" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader title="Schools" subtitle={`${filtered.length} tenant schools (demo)`} breadcrumb="Platform" actions={<Button onClick={() => { reset({ planId: "plan-starter", name: "", city: "" }); setOpen(true); }}><Plus className="h-4 w-4" /> Create demo school</Button>} />
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Search school or location…" className="sm:max-w-sm w-full" />
          <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
            <option value="all">All statuses</option><option value="active">Active</option><option value="trial">Trial</option><option value="suspended">Suspended</option><option value="archived">Archived</option>
          </Select>
        </div>
        {filtered.length === 0 ? <EmptyState title="No schools" desc="Adjust search or create a demo school." /> : (
          <TableShell>
            <thead><tr><Th>School</Th><Th>Location</Th><Th>Plan</Th><Th>Students</Th><Th>Status</Th><Th>Joined</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <Td><span className="font-medium">{s.name}</span><span className="block text-xs text-slate-500">{s.code}</span></Td>
                  <Td>{s.location}</Td>
                  <Td>
                    <Select aria-label={`Plan for ${s.name}`} value={s.planId} onChange={(e) => { updatePlatformSchool(s.id, { planId: e.target.value }); toast({ kind: "success", title: "Plan assigned (demo)" }); }} className="h-8 w-32 text-xs">
                      {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </Select>
                  </Td>
                  <Td className="tabular-nums">{studentCounts[s.id] ?? 120}</Td>
                  <Td><StatusBadge status={s.status} /></Td>
                  <Td>{formatDate(s.joinedDate)}</Td>
                  <Td className="text-right">
                    <Select
                      aria-label={`Status for ${s.name}`}
                      value={s.status}
                      onChange={(e) => { updatePlatformSchool(s.id, { status: e.target.value as typeof s.status }); toast({ kind: "info", title: "School status updated (demo)" }); }}
                      className="h-8 w-32 text-xs"
                    >
                      <option value="active">Active</option><option value="trial">Trial</option><option value="suspended">Suspended</option><option value="archived">Archived</option>
                    </Select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create demo school" desc="Local mock state only">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-3">
          <div><Label htmlFor="dn">School name *</Label><Input id="dn" {...register("name")} /><FieldError message={errors.name?.message} /></div>
          <div><Label htmlFor="dc">City *</Label><Input id="dc" {...register("city")} /><FieldError message={errors.city?.message} /></div>
          <div><Label htmlFor="dp">Plan *</Label><Select id="dp" {...register("planId")}>{plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
        </form>
      </Dialog>
    </div>
  );
}
