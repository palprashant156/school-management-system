"use client";

import Link from "next/link";
import { Building2, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { plans } from "@/data/seed";
import { formatNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/ui";
import { PageHeader, KpiCard, TableSkeleton } from "@/components/shared/shared";

export default function PlatformOverview() {
  const { platformSchools, hydrated } = useStore();
  if (!hydrated) return <TableSkeleton />;

  const total = platformSchools.length;
  const active = platformSchools.filter((s) => s.status === "active").length;
  const totalStudents = 1240 + 860 + 3120 + 320 + 410 + 640; // mock aggregate
  const nearLimit = platformSchools.slice(0, 2);

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        subtitle="All tenant schools · demo data · distinct from school administration"
        actions={<Link href="/platform/schools"><Button variant="outline">Manage schools</Button></Link>}
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Schools" value={formatNumber(total)} hint="Across all plans" icon={<Building2 className="h-4 w-4" />} />
        <KpiCard label="Active Schools" value={formatNumber(active)} hint="In good standing" icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Total Students" value={formatNumber(totalStudents)} hint="Across platform (mock)" icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Near Plan Limits" value={formatNumber(2)} hint="Above 85% capacity" icon={<AlertTriangle className="h-4 w-4" />} />
      </div>
      <div className="grid xl:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader><CardTitle>Schools approaching limits</CardTitle><CardDesc>Mock capacity signals</CardDesc></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {nearLimit.map((s) => (
              <div key={s.id} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-medium">{s.name}</span>
                <span className="text-amber-700 font-medium">92% of plan</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Plans at a glance</CardTitle><CardDesc>Configured centrally, not scattered in components</CardDesc></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {plans.map((p) => (
              <div key={p.id} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-medium">{p.name} · {p.activeSchools} schools</span>
                <Link href="/platform/plans" className="text-indigo-700 font-medium">View</Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
