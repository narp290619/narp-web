export type Policy = {
    title: string;
    href: string;
    icon: string;
};

export const policies: Policy[] = [
    {
        title: "Privacy Policy",
        href: "/legal/privacy",
        icon: "🔒",
    },
    {
        title: "Terms of Service",
        href: "/legal/terms",
        icon: "📜",
    },
    {
        title: "Escrow Policy",
        href: "/legal/escrow",
        icon: "🛡️",
    },
    {
        title: "Withdrawal Policy",
        href: "/legal/withdrawal",
        icon: "💳",
    },
    {
        title: "Refund Policy",
        href: "/legal/refund",
        icon: "💰",
    },
    {
        title: "Cancellation Policy",
        href: "/legal/cancellation",
        icon: "❌",
    },
    {
        title: "Dispute Resolution",
        href: "/legal/dispute-resolution",
        icon: "⚖️",
    },
    {
        title: "Cookie Policy",
        href: "/legal/cookies",
        icon: "🍪",
    },
    {
        title: "Community Guidelines",
        href: "/legal/community-guidelines",
        icon: "🤝",
    },
    {
        title: "Acceptable Use Policy",
        href: "/legal/acceptable-use",
        icon: "🚫",
    },
];

export const relatedPolicies: Record<string, string[]> = {

    "/legal/privacy": [
        "/legal/cookies",
        "/legal/terms",
        "/legal/acceptable-use",
    ],

    "/legal/terms": [
        "/legal/privacy",
        "/legal/refund",
        "/legal/community-guidelines",
        "/legal/acceptable-use",
    ],

    "/legal/escrow": [
        "/legal/refund",
        "/legal/dispute-resolution",
        "/legal/terms",
    ],

    "/legal/withdrawal": [
        "/legal/escrow",
        "/legal/refund",
        "/legal/terms",
    ],

    "/legal/refund": [
        "/legal/escrow",
        "/legal/cancellation",
        "/legal/dispute-resolution",
        "/legal/terms",
    ],

    "/legal/cancellation": [
        "/legal/refund",
        "/legal/escrow",
        "/legal/terms",
    ],

    "/legal/dispute-resolution": [
        "/legal/refund",
        "/legal/escrow",
        "/legal/terms",
    ],

    "/legal/community-guidelines": [
        "/legal/acceptable-use",
        "/legal/terms",
        "/legal/dispute-resolution",
    ],

    "/legal/acceptable-use": [
        "/legal/community-guidelines",
        "/legal/privacy",
        "/legal/terms",
    ],

    "/legal/cookies": [
        "/legal/privacy",
        "/legal/terms",
    ],

};