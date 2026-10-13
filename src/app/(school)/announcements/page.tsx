"use client";

import { useMemo, useState } from "react";
import { Plus, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/lib/store";
import { classes } from "@/data/seed";
import { formatDate } from "@/lib/formatters";
import { Button, Card, Input, Label, Select, Textarea, Dialog, FieldError, Badge } from "@/components/ui/ui";
import { PageHeader, SearchInput, StatusBadge, EmptyState, TableSkeleton, DemoNote } from "@/components/shared/shared";

const schema = z.object({
  title: z.string().min(4, "Title required"),
  message: z.string().min(10, "Message should be at least 10 characters"),
  audience: z.enum(["Entire school", "Teachers", "Parents", "Selected classes"]),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type V = z.infer<typeof schema>;

export default function AnnouncementsPage() {
  const { announcements, hydrated, addAnnouncement, updateAnnouncement, toast } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [clsSel, setClsSel] = useState<string[]>([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { audience: "Entire school" },
  });
  const audience = watch("audience");
  const wTitle = watch("title");
  const wMsg = watch("message");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return announcements.filter((a) =>
      (!n || a.title.toLowerCase().includes(n) || a.message.toLowerCase().includes(n)) &&
      (status === "all" || a.status === status)
    );
  }, [announcements, q, status]);

  if (!hydrated) return <TableSkeleton />;

  function openNew() {
    setEditId(null); setClsSel([]);
    reset({ audience: "Entire school", title: "", message: "", publishDate: "", expiryDate: "" });
    setOpen(true);
  }
  function openEdit(id: string) {
    const a = announcements.find((x) => x.id === id);
    if (!a || a.status === "published") return;
    setEditId(id); setClsSel(a.classIds ?? []);
    setValue("title", a.title); setValue("message", a.message);
    setValue("audience", a.audience); setValue("publishDate", a.publishDate ?? ""); setValue("expiryDate", a.expiryDate ?? "");
    setOpen(true);
  }

  function onSubmit(v: V, publish: boolean) {
    const payload = {
      title: v.title,
      message: v.message,
      audience: v.audience,
      classIds: v.audience === "Selected classes" ? clsSel : undefined,
      publishDate: v.publishDate || undefined,
      expiryDate: v.expiryDate || undefined,
      status: (publish ? "published" : "draft") as "published" | "draft",
    };
    if (editId) {
      updateAnnouncement(editId, payload);
      toast({ kind: "success", title: publish ? "Announcement published (demo)" : "Draft updated" });
    } else {
      addAnnouncement({ id: `ann-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10), ...payload });
      toast({ kind: "success", title: publish ? "Announcement published (demo)" : "Draft saved", desc: "Mock notification status: queued." });
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader title="Announcements" subtitle={`${filtered.length} announcements`} actions={<Button onClick={openNew}><Plus className="h-4 w-4" /> Create announcement</Button>} />
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-2">
          <SearchInput value={q} onChange={setQ} placeholder="Search announcements…" className="sm:max-w-sm w-full" />
          <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
            <option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
          </Select>
        </div>
        {filtered.length === 0 ? <EmptyState title="No announcements" desc="Create your first announcement." action={<Button onClick={openNew}><Plus className="h-4 w-4" /> Create</Button>} /> : (
          <div className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <div key={a.id} className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row gap-3 sm:items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <StatusBadge status={a.status} />
                    <Badge tone="slate">{a.audience}</Badge>
                  </div>
                  <p className="text-[13px] text-slate-600 mt-1 line-clamp-2">{a.message}</p>
                  <p className="text-xs text-slate-400 mt-1">Created {formatDate(a.createdAt)}{a.publishDate ? ` · Publishes ${formatDate(a.publishDate)}` : ""}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {a.status === "draft" && <Button variant="outline" size="sm" onClick={() => openEdit(a.id)}>Edit draft</Button>}
                  {a.status === "draft" && <Button size="sm" onClick={() => { updateAnnouncement(a.id, { status: "published", publishDate: new Date().toISOString().slice(0, 10) }); toast({ kind: "success", title: "Published (demo)" }); }}>Publish</Button>}
                  {a.status === "published" && <Button variant="outline" size="sm" onClick={() => { updateAnnouncement(a.id, { status: "draft" }); toast({ kind: "info", title: "Unpublished", desc: "Moved back to drafts (demo)." }); }}>Unpublish</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="p-4"><DemoNote text="Demo only — no SMS, email or WhatsApp is actually sent." /></div>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editId ? "Edit draft" : "Create announcement"} desc="Live preview on the right (desktop)" wide>
        <form className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div><Label htmlFor="at">Title *</Label><Input id="at" {...register("title")} placeholder="e.g. PTM on Saturday" /><FieldError message={errors.title?.message} /></div>
            <div><Label htmlFor="am">Message *</Label><Textarea id="am" {...register("message")} placeholder="Write a clear, parent-friendly message…" /><FieldError message={errors.message?.message} /></div>
            <div>
              <Label htmlFor="aa">Audience *</Label>
              <Select id="aa" {...register("audience")}>
                <option>Entire school</option><option>Teachers</option><option>Parents</option><option>Selected classes</option>
              </Select>
            </div>
            {audience === "Selected classes" && (
              <div>
                <Label>Classes</Label>
                <div className="flex flex-wrap gap-1.5">
                  {classes.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setClsSel((s) => s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id])}
                      className={`text-xs font-medium border rounded-full px-2.5 py-1 ${clsSel.includes(c.id) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-200"}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div><Label htmlFor="ap">Publish date</Label><Input id="ap" type="date" {...register("publishDate")} /></div>
              <div><Label htmlFor="ae">Expiry date</Label><Input id="ae" type="date" {...register("expiryDate")} /></div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" onClick={handleSubmit((v) => onSubmit(v, false))}>Save draft</Button>
              <Button type="button" onClick={handleSubmit((v) => onSubmit(v, true))}>Publish</Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Live preview</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold">{wTitle || "Announcement title"}</p>
              <p className="text-[13px] text-slate-600 mt-1 whitespace-pre-wrap">{wMsg || "Your message preview appears here…"}</p>
              <p className="text-[11px] text-slate-400 mt-2">{audience}{clsSel.length > 0 && audience === "Selected classes" ? ` · ${clsSel.length} classes` : ""}</p>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
