import {
  LayoutDashboard,
  Users,
  Briefcase,
  School,
  ClipboardCheck,
  Wallet,
  Megaphone,
  BarChart3,
  Settings,
  Building2,
  CreditCard,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const schoolNav: NavGroup[] = [
  { title: "Overview", items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    title: "School Management",
    items: [
      { label: "Students", href: "/students", icon: Users, match: ["/students"] },
      { label: "Staff", href: "/staff", icon: Briefcase, match: ["/staff"] },
      { label: "Classes & Sections", href: "/classes", icon: School, match: ["/classes"] },
    ],
  },
  {
    title: "Daily Operations",
    items: [
      { label: "Attendance", href: "/attendance", icon: ClipboardCheck },
      { label: "Fees & Finance", href: "/fees", icon: Wallet, match: ["/fees"] },
      { label: "Announcements", href: "/announcements", icon: Megaphone },
    ],
  },
  { title: "Insights", items: [{ label: "Reports", href: "/reports", icon: BarChart3 }] },
  { title: "Configuration", items: [{ label: "Settings", href: "/settings", icon: Settings, match: ["/settings"] }] },
];

export const platformNav: NavGroup[] = [
  {
    title: "Platform",
    items: [
      { label: "Platform Overview", href: "/platform", icon: Building2 },
      { label: "Schools", href: "/platform/schools", icon: School },
      { label: "Plans & Subscriptions", href: "/platform/plans", icon: CreditCard },
    ],
  },
];

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.match) return item.match.some((m) => pathname === m || pathname.startsWith(m + "/"));
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
