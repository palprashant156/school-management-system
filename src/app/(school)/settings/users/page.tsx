"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { Button, Card, Input, Label, Select, Dialog, FieldError, Avatar } from "@/components/ui/ui";
import { SearchInput, StatusBadge, TableShell, Th, Td, TableSkeleton } from "@/components/shared/shared";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["School Owner", "Principal", "Administrator", "Accountant", "Teacher"]),
});

export default function UsersSettingsPage() {
  const { users, hydrated, inviteUser, updateUserStatus, toast } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Teacher" },
  });

  if (!hydrated) return <TableSkeleton />;

  const filtered = users.filter((u) => !q.trim() || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <SearchInput value={q} onChange={setQ} placeholder="Search users…" className="sm:max-w-xs w-full" />
          <Button onClick={() => { reset({ role: "Teacher", name: "", email: "" }); setOpen(true); }}><Plus className="h-4 w-4" /> Invite user</Button>
        </div>
        <TableShell>
          <thead><tr><Th>User</Th><Th>Role</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <Td><span className="flex items-center gap-2"><Avatar name={u.name} className="h-8 w-8 text-xs" /><span><span className="font-medium block">{u.name}</span><span className="text-xs text-slate-500">{u.email}</span></span></span></Td>
                <Td>{u.role}</Td>
                <Td><StatusBadge status={u.status} /></Td>
                <Td className="text-right">
                  {u.status === "invited"
                    ? <Button variant="outline" size="sm" onClick={() => { updateUserStatus(u.id, "active"); toast({ kind: "success", title: "Invite accepted (demo)" }); }}>Resend invite</Button>
                    : <Button variant="ghost" size="sm" onClick={() => { updateUserStatus(u.id, u.status === "active" ? "disabled" : "active"); toast({ kind: "info", title: "User status updated" }); }}>{u.status === "active" ? "Disable" : "Enable"}</Button>}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} title="Invite user" desc="Demo invite — no email is sent">
        <form onSubmit={handleSubmit((v) => {
          inviteUser({ id: `u-${Date.now()}`, status: "invited", ...v });
          toast({ kind: "success", title: "Invite sent (demo)" });
          setOpen(false);
        })} className="space-y-3">
          <div><Label htmlFor="un">Name *</Label><Input id="un" {...register("name")} /><FieldError message={errors.name?.message} /></div>
          <div><Label htmlFor="ue">Email *</Label><Input id="ue" {...register("email")} /><FieldError message={errors.email?.message} /></div>
          <div><Label htmlFor="ur">Role *</Label><Select id="ur" {...register("role")}><option>School Owner</option><option>Principal</option><option>Administrator</option><option>Accountant</option><option>Teacher</option></Select></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Send invite</Button></div>
        </form>
      </Dialog>
    </div>
  );
}
