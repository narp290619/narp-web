export type HelpArticle = {
    title: string;
    href: string;
    description: string;
};

export const helpArticles: HelpArticle[] = [
    {
        title: "Booking Services",
        href: "/help/bookings",
        description: "Learn how booking works on NARP.",
    },
    {
        title: "Payments",
        href: "/help/payments",
        description: "Payment methods, escrow and refunds.",
    },
    {
        title: "Account",
        href: "/help/account",
        description: "Managing your NARP account.",
    },
    {
        title: "Safety",
        href: "/help/safety",
        description: "Stay safe while using NARP.",
    },
    {
        title: "Ratings & Reviews",
        href: "/help/reviews",
        description: "Understanding ratings and reviews.",
    },
    {
        title: "Using the Mobile App",
        href: "/help/mobile-app",
        description: "Getting started with the mobile app.",
    },
];

export const relatedHelpArticles: Record<string, string[]> = {
    "/help/bookings": [
        "/help/payments",
        "/help/account",
        "/help/safety",
    ],

    "/help/payments": [
        "/help/bookings",
        "/help/account",
        "/help/reviews",
    ],

    "/help/account": [
        "/help/bookings",
        "/help/mobile-app",
        "/help/safety",
    ],

    "/help/safety": [
        "/help/account",
        "/help/reviews",
        "/help/bookings",
    ],

    "/help/reviews": [
        "/help/bookings",
        "/help/safety",
        "/help/payments",
    ],

    "/help/mobile-app": [
        "/help/account",
        "/help/bookings",
        "/help/payments",
    ],
};