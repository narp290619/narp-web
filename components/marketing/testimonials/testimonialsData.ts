export interface Testimonial {
    name: string;
    role: string;
    location: string;
    avatar: string;
    rating: number;
    review: string;
}

export const testimonials: Testimonial[] = [
    {
        name: "Alyssa",
        role: "Homeowner",
        location: "Quezon City",
        avatar: "https://firebasestorage.googleapis.com/v0/b/narp-database.firebasestorage.app/o/files%2Fdata%2Fuser%2F0%2Fcom.example.chat%2Fcache%2F9e95aa85-8669-4484-b5b6-de717fb4061e%2F1000000023.png?alt=media&token=39ffcf5d-c408-4477-84d8-c878b2b8beb4",
        rating: 5,
        review:
            "I found a reliable electrician in less than 15 minutes. Booking was simple, transparent, and the live tracking gave me confidence.",
    },
    {
        name: "Michael",
        role: "Freelancer",
        location: "Cebu",
        avatar: "https://firebasestorage.googleapis.com/v0/b/narp-database.firebasestorage.app/o/files%2Fdata%2Fuser%2F0%2Fcom.example.chat%2Fcache%2F9e95aa85-8669-4484-b5b6-de717fb4061e%2F1000000023.png?alt=media&token=39ffcf5d-c408-4477-84d8-c878b2b8beb4",
        rating: 5,
        review:
            "NARP helped me receive more quality bookings and build trust with new clients without depending only on social media.",
    },
    {
        name: "Sophia",
        role: "Business Owner",
        location: "Davao",
        avatar: "https://firebasestorage.googleapis.com/v0/b/narp-database.firebasestorage.app/o/files%2Fdata%2Fuser%2F0%2Fcom.example.chat%2Fcache%2F9e95aa85-8669-4484-b5b6-de717fb4061e%2F1000000023.png?alt=media&token=39ffcf5d-c408-4477-84d8-c878b2b8beb4",
        rating: 5,
        review:
            "Finding verified freelancers for maintenance work is now much faster, and secure payments make every booking worry-free.",
    },
];