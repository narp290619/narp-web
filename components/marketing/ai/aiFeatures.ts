// export interface AIFeature {
//   title: string;
//   description: string;
//   icon: string;
// }

// export const aiFeatures: AIFeature[] = [
//   {
//     icon: "🧠",
//     title: "AI Smart Matching",
//     description:
//       "Instantly recommends the most suitable professionals based on skills, location, ratings, availability, and experience.",
//   },
//   {
//     icon: "😊",
//     title: "AI Face Verification",
//     description:
//       "Helps verify identities during important account and booking actions to reduce fraud and build trust.",
//   },
//   {
//     icon: "💬",
//     title: "AI Assistant",
//     description:
//       "Assists professionals with quick replies, helping them respond to customers faster.",
//   },
//   {
//     icon: "⭐",
//     title: "Smart Recommendations",
//     description:
//       "Continuously improves search results based on user activity and successful bookings.",
//   },
// ];


import {
    Brain,
    ScanFace,
    MessageCircle,
    ShieldCheck,
} from "lucide-react";

export const aiFeatures = [
    {
        icon: Brain,
        title: "AI Match",
        description:
            "Finds the best professionals using skills, ratings, distance and availability.",
        color: "orange",
    },
    {
        icon: ScanFace,
        title: "AI Verify",
        description:
            "Face verification helps confirm the identity of clients and professionals during important account and booking actions.",
        color: "blue",
    },
    {
        icon: MessageCircle,
        title: "AI Assist",
        description:
            "AI-assisted replies help professionals respond to customers faster and more consistently.",
        color: "green",
    },
    {
        icon: ShieldCheck,
        title: "AI Protect",
        description:
            "Supports safer bookings with identity checks, verified reviews, and secure payment workflows.",
        color: "purple",
    },
];