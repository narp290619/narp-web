export type Policy = {
    title: string;
    href: string;
    icon: string;
    description: string;
    related?: string[];
};

export const policies: Policy[] = [
    {
        title: "Privacy Policy",
        href: "/legal/privacy",
        icon: "🔒",
        description:
            "How we collect, use and protect your information.",
        related: [
            "/legal/cookies",
            "/legal/terms",
            "/legal/acceptable-use",
        ],
    },

    {
        title: "Terms of Service",
        href: "/legal/terms",
        icon: "📜",
        description:
            "Rules for using the NARP platform.",
        related: [
            "/legal/privacy",
            "/legal/refund",
            "/legal/community-guidelines",
            "/legal/acceptable-use",
        ],
    },

    {
        title: "Escrow Policy",
        href: "/legal/escrow",
        icon: "🛡️",
        description:
            "How escrow protects clients and freelancers.",
        related: [
            "/legal/refund",
            "/legal/dispute-resolution",
            "/legal/terms",
        ],
    },

    {
        title: "Withdrawal Policy",
        href: "/legal/withdrawal",
        icon: "💳",
        description:
            "Rules for withdrawing earnings from your wallet.",
        related: [
            "/legal/escrow",
            "/legal/refund",
            "/legal/terms",
        ],
    },

    {
        title: "Refund Policy",
        href: "/legal/refund",
        icon: "💰",
        description:
            "Refund eligibility and payment reversals.",
        related: [
            "/legal/escrow",
            "/legal/cancellation",
            "/legal/dispute-resolution",
            "/legal/terms",
        ],
    },

    {
        title: "Cancellation Policy",
        href: "/legal/cancellation",
        icon: "❌",
        description:
            "When bookings may be cancelled.",
        related: [
            "/legal/refund",
            "/legal/escrow",
            "/legal/terms",
        ],
    },

    {
        title: "Dispute Resolution",
        href: "/legal/dispute-resolution",
        icon: "⚖️",
        description:
            "How disputes are investigated and resolved.",
        related: [
            "/legal/refund",
            "/legal/escrow",
            "/legal/terms",
        ],
    },

    {
        title: "Cookie Policy",
        href: "/legal/cookies",
        icon: "🍪",
        description:
            "How cookies are used on our website.",
        related: [
            "/legal/privacy",
            "/legal/terms",
        ],
    },

    {
        title: "Community Guidelines",
        href: "/legal/community-guidelines",
        icon: "🤝",
        description:
            "Expected behavior within the NARP community.",
        related: [
            "/legal/acceptable-use",
            "/legal/terms",
            "/legal/dispute-resolution",
        ],
    },

    {
        title: "Acceptable Use Policy",
        href: "/legal/acceptable-use",
        icon: "🚫",
        description:
            "Activities prohibited on NARP.",
        related: [
            "/legal/community-guidelines",
            "/legal/privacy",
            "/legal/terms",
        ],
    },
];