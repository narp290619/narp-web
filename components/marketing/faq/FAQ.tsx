import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import FAQItem from "./FAQItem";
import { faqData } from "./faqData";

export default function FAQ() {
    return (
        <section
            id="faq"
            className="bg-white py-28">

            <Container>

                <SectionTitle
                    badge="FAQ"
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know about booking trusted professionals through NARP."
                />

                <div className="mx-auto mt-16 max-w-4xl space-y-5">

                    {faqData.map((item, index) => (

                        <FAQItem
                            key={item.question}
                            {...item}
                            defaultOpen={index === 0}
                        />

                    ))}

                </div>

                <div className="mt-24 text-center">

                    <h3
                        className="
            text-3xl
            font-bold
            text-slate-900
        "
                    >
                        Still have questions?
                    </h3>

                    <p
                        className="
            mt-4
            text-lg
            text-slate-600
        "
                    >
                        Our team is happy to help you get started with NARP.
                    </p>

                    <a
                        href="#contact"
                        className="
            mt-8
            inline-flex
            items-center
            rounded-full
            bg-orange-500
            px-8
            py-4
            font-semibold
            text-white
            transition
            hover:bg-orange-600
        "
                    >
                        Contact Us
                    </a>

                </div>

            </Container>

        </section>
    );
}