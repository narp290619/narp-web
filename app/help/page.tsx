import FAQSection from "@/components/help/FAQSection";
import HelpHero from "@/components/help/HelpHero";
import PopularTopics from "@/components/help/PopularTopics";

export const metadata = {
    title: "Help Center | NARP",
    description:
        "Find answers to common questions about bookings, payments, accounts, and using NARP.",
};

export default function HelpPage() {
    return (
        <main className="min-h-screen bg-gray-100">

            <HelpHero />

            <section className="mx-auto max-w-7xl px-6 py-16 space-y-16">

                <PopularTopics />

                <FAQSection />

                {/* <ContactSupportCard /> */}

            </section>

        </main>
    );
}