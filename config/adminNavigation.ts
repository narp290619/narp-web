import {
    LayoutDashboard,
    Briefcase,
    Users,
    CalendarDays,
    Star,
    MapPinned,
    BrainCircuit,
    FileText,
    CircleHelp,
    Settings,
} from "lucide-react";

export const adminNavigation = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Skills",
        href: "/admin/skills",
        icon: Briefcase,
    },
    {
        title: "Freelancers",
        href: "/admin/freelancers",
        icon: Users,
    },
    {
        title: "Bookings",
        href: "/admin/bookings",
        icon: CalendarDays,
    },
    {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
    },
    {
        title: "Coverage",
        href: "/admin/coverage",
        icon: MapPinned,
    },
    {
        title: "AI",
        href: "/admin/ai",
        icon: BrainCircuit,
    },
    {
        title: "Blog",
        href: "/admin/blog",
        icon: FileText,
    },
    {
        title: "FAQ",
        href: "/admin/faq",
        icon: CircleHelp,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];