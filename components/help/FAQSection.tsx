"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
    question: string;
    answer: string;
};

const faqs: FAQ[] = [
    {
        question: "How do I book a freelancer?",
        answer:
            "Browse available services, choose a freelancer, select your preferred schedule, review the booking details, and complete payment to confirm your booking.",
    },
    {
        question: "How does escrow work?",
        answer:
            "Your payment is securely held in escrow after booking. Funds are only released to the freelancer after the service is completed and confirmed, providing protection for both parties.",
    },
    {
        question: "How do refunds work?",
        answer:
            "Refund eligibility depends on the circumstances of your booking and is governed by the NARP Refund Policy. Approved refunds are returned through the original payment method whenever possible.",
    },
    {
        question: "How do cancellations work?",
        answer:
            "Clients and freelancers may cancel bookings subject to the NARP Cancellation Policy. Depending on the timing and reason for cancellation, fees or refunds may apply.",
    },
    {
        question: "How do I withdraw my earnings?",
        answer:
            "Once escrow funds are released, eligible balances are credited to your NARP Wallet. You may then request a withdrawal using one of the supported withdrawal methods.",
    },
    {
        question: "How do I become a freelancer?",
        answer:
            "Create a NARP account, complete your profile, submit the required verification documents, and wait for approval before offering your services.",
    },
    {
        question: "How do I report a user?",
        answer:
            "If you encounter abusive behavior, fraud, or suspicious activity, contact NARP Support immediately. We will investigate reports and take appropriate action.",
    },
    {
        question: "How do I delete my account?",
        answer:
            "You may request account deletion by contacting NARP Support. Certain information may be retained where required by law or for fraud prevention purposes.",
    },
];

function FAQItem({
    faq,
    isOpen,
    onClick,
}: {
    faq: FAQ;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            <button
                onClick={onClick}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-6
                    py-5
                    text-left
                    transition
                    hover:bg-slate-50
                "
            >
                <span className="text-lg font-semibold text-slate-900">
                    {faq.question}
                </span>

                <ChevronDown
                    className={`
                        h-5
                        w-5
                        text-slate-500
                        transition-transform
                        duration-300
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            <div
                className={`
                    grid
                    transition-all
                    duration-300
                    ${
                        isOpen
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                    }
                `}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-slate-200 px-6 py-5 leading-8 text-slate-600">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section>

            <div className="mb-8 text-center">

                <h2 className="text-3xl font-bold text-slate-900">
                    Frequently Asked Questions
                </h2>

                <p className="mt-3 text-slate-600">
                    Quick answers to the questions we receive most often.
                </p>

            </div>

            <div className="mx-auto max-w-4xl space-y-4">

                {faqs.map((faq, index) => (
                    <FAQItem
                        key={faq.question}
                        faq={faq}
                        isOpen={openIndex === index}
                        onClick={() =>
                            setOpenIndex(
                                openIndex === index
                                    ? null
                                    : index
                            )
                        }
                    />
                ))}

            </div>

        </section>
    );
}