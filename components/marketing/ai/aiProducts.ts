export interface AIProduct {
    name: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const aiProducts: AIProduct[] = [

{
    name: "AI Match",

    icon: "🧠",

    color: "orange",

    title: "Find the Right Freelancer",

    description:
        "Analyzes skills, ratings, availability, experience and distance to recommend the best freelancer in seconds.",
},

{
    name: "AI Verify",

    icon: "😊",

    color: "blue",

    title: "Identity Verification",

    description:
        "Face verification helps confirm account ownership during important account and booking actions.",
},

{
    name: "AI Assist",

    icon: "💬",

    color: "green",

    title: "Smart Communication",

    description:
        "Provides AI-assisted replies so freelancers can answer customer inquiries faster.",
},

{
    name: "AI Protect",

    icon: "🛡",

    color: "purple",

    title: "Booking Protection",

    description:
        "Escrow payments, verified reviews and intelligent fraud prevention work together to create safer transactions.",
},

];