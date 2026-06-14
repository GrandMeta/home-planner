import {
  LayoutDashboard,
  Building2,
  GitCompare,
  Map,
  ClipboardList,
  TrendingUp,
  CreditCard,
  FileText,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Master overview of all evaluations",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: Building2,
    description: "All tracked real estate projects",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: GitCompare,
    description: "Side-by-side unit comparison",
  },
  {
    label: "Map",
    href: "/map",
    icon: Map,
    description: "Project locations and commute analysis",
  },
  {
    label: "Site Visits",
    href: "/site-visits",
    icon: ClipboardList,
    description: "Structured site visit checklists",
  },
  {
    label: "Financials",
    href: "/financials",
    icon: TrendingUp,
    description: "True cost and financial analysis",
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    description: "Payment milestone tracking",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
    description: "Legal, RERA, and builder documents",
  },
  {
    label: "Follow-Ups",
    href: "/follow-ups",
    icon: Bell,
    description: "Pending actions and builder follow-ups",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences and data management",
  },
];
