import { JourneyScene } from "./types";

export const journey: JourneyScene[] = [
    {
        id: "ai",
        title: "AI Matching",
        subtitle: "Finding your best freelancer",
        assistantMessages: [
            "Finding nearby Builders...",
            "Comparing ratings and reviews...",
            "98% match found.",
        ],
        icon: "brain",
        accentColor: "#f97316",
        duration: 3500,
    },
    {
        id: "face",
        title: "Face Verification",
        subtitle: "Identity protection",
        assistantMessages: [
            "Scanning facial features...",
            "Matching government ID...",
            "Identity verified.",
        ],
        icon: "shield",
        accentColor: "#22c55e",
        duration: 3500,
    },
    {
        id: "tracking",
        title: "Live Tracking",
        subtitle: "Builder is on the way",
        assistantMessages: [
            "Builder accepted your booking.",
            "Driver is 1.4 km away.",
            "ETA updated to 2 minutes.",
        ],
        icon: "map",
        accentColor: "#3b82f6",
        duration: 3500,
    },
    {
        id: "timeline",
        title: "Job Progress",
        subtitle: "Stay updated in real time",
        assistantMessages: [
            "Builder has arrived.",
            "Work is now in progress.",
            "Estimated completion: 45 minutes.",
        ],
        icon: "timeline",
        accentColor: "#f59e0b",
        duration: 3500,
    },
    {
        id: "payment",
        title: "Protected Payment",
        subtitle: "Secure escrow for every booking",
        assistantMessages: [
            "Payment received.",
            "Funds are securely protected.",
            "Release after completion.",
        ],
        icon: "wallet",
        accentColor: "#8b5cf6",
        duration: 3500,
    },
    {
        id: "success",
        title: "Job Completed",
        subtitle: "Thank you for choosing NARP",
        assistantMessages: [
            "Everything completed successfully.",
            "Please rate your experience.",
            "Thank you for choosing NARP.",
        ],
        icon: "success",
        accentColor: "#10b981",
        duration: 4000,
    },
];