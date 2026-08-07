import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

import HelpHero from "@/components/help/HelpHero";
import HelpSearch from "@/components/help/HelpSearch";
import PopularTopics from "@/components/help/PopularTopics";
import FAQSection from "@/components/help/FAQSection";
import ContactSupportCard from "@/components/help/ContactSupportCard";

export const metadata = {
    title: "Help Center | NARP",
    description:
        "Find answers to common questions about bookings, payments, accounts, reviews, and using NARP.",
};

export default function HelpCenterPage() {
    return (
        <PageContainer>

            <HelpHero />

            <Container className="max-w-5xl pb-20">

                <div className="space-y-16">

                    <HelpSearch />

                    <PopularTopics />

                    <FAQSection />

                    <ContactSupportCard />

                </div>

            </Container>

        </PageContainer>
    );
}