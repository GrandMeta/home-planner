import {
  Home,
  Building2,
  GitCompare,
  Map,
  ClipboardCheck,
  Wallet,
  CreditCard,
  FileText,
  CheckSquare,
  GraduationCap,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavSection = "Explore" | "Track" | "Help";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  section: NavSection;
};

/**
 * Navigation rewritten in plain language for first-time buyers.
 * Routes are unchanged so nothing breaks — only the words people read.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    description: "Your journey and what to do next",
    section: "Explore",
  },
  {
    label: "My Properties",
    href: "/projects",
    icon: Building2,
    description: "Every home, villa or plot you're looking at",
    section: "Explore",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: GitCompare,
    description: "See your options side by side",
    section: "Explore",
  },
  {
    label: "On the Map",
    href: "/map",
    icon: Map,
    description: "Where everything is, and how far",
    section: "Explore",
  },
  {
    label: "Visits",
    href: "/site-visits",
    icon: ClipboardCheck,
    description: "Plan visits and remember what you saw",
    section: "Track",
  },
  {
    label: "True Cost",
    href: "/financials",
    icon: Wallet,
    description: "The real, all-in price of each home",
    section: "Track",
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    description: "What's due and when",
    section: "Track",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
    description: "Brochures, approvals and paperwork",
    section: "Track",
  },
  {
    label: "My Tasks",
    href: "/follow-ups",
    icon: CheckSquare,
    description: "Questions to ask and things to do",
    section: "Track",
  },
  {
    label: "Learn",
    href: "/learn",
    icon: GraduationCap,
    description: "Home-buying basics, in plain English",
    section: "Help",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Preferences and your data",
    section: "Help",
  },
];

export const NAV_SECTIONS: NavSection[] = ["Explore", "Track", "Help"];
