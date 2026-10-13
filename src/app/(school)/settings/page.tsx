"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/ui";
import { formatNumber } from "@/lib/formatters";

export default function SettingsOverview() {
  const { school, students, staff, users, resetDemo, toast } = useStore();
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle>{school.name}</CardTitle><CardDesc>{school.code} · {school.city}, {school.state}</CardDesc></CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>{formatNumber(students.length)} students · {staff.length} staff · {users.length} users</p>
          <p className="text-slate-500">Academic year {school.academicYear} · {school.timezone} · {school.currency}</p>
          <div className="flex gap-2 pt-2">
            <Link href="/settings/school"><Button variant="outline" size="sm">Edit school</Button></Link>
            <Link href="/settings/subscription"><Button variant="outline" size="sm">Subscription</Button></Link>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Demo data</CardTitle><CardDesc>Reset local mock data at any time</CardDesc></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">All changes in this demo are stored in your browser. Reset to restore the original seed data.</p>
          <Button variant="outline" className="mt-3" onClick={() => { resetDemo(); toast({ kind: "success", title: "Demo data reset" }); }}>Reset to demo data</Button>
        </CardContent>
      </Card>
    </div>
  );
}
