export interface TrustFeature {
    title: string;
    description: string;
    icon: string;
}

export const trustFeatures: TrustFeature[] = [
    {
        icon: "🪪",
        title: "Verified Identity",
        description:
            "Every freelancer completes identity verification before offering services, giving clients greater confidence when booking.",
    },
    {
        icon: "😊",
        title: "AI Face Verification",
        description:
            "AI-powered face verification helps confirm identities during account registration and important booking activities.",
    },
    {
        icon: "🧠",
        title: "AI Smart Matching",
        description:
            "NARP AI recommends the best freelancers based on skills, ratings, availability, and location.",
    },
    {
        icon: "💳",
        title: "Secure Escrow",
        description:
            "Payments are securely held and released only after the completed work has been approved.",
    },
    {
        icon: "📍",
        title: "Live Tracking",
        description:
            "Know exactly when your freelancer is arriving through real-time location tracking.",
    },
    {
        icon: "⭐",
        title: "Verified Reviews",
        description:
            "Only completed bookings can leave reviews, ensuring authentic ratings from real customers.",
    },
];