import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import { aiFeatures } from "./aiFeatures";
import AICard from "./AICard";
import AIPhone from "./AIPhone";

export default function AISection() {
    return (
        <section
            className="
                relative
                overflow-hidden
                bg-gradient-to-b
                from-slate-50
                via-white
                to-slate-50
                py-32
            "
        >
            {/* Background Glow */}

            <div
                className="
                    absolute
                    right-0
                    top-20

                    h-[500px]
                    w-[500px]

                    rounded-full

                    bg-blue-200/30

                    blur-3xl
                "
            />

            <Container>

                <SectionTitle
                    badge="NARP AI"
                    title="The Intelligence Behind Every Booking"
                    subtitle="Describe what you need, and NARP AI instantly finds the best freelancers based on skills, location, availability, and reputation."
                />

                <div
                    className="
                        relative
                        mt-24

                        grid
                        items-center
                        gap-20

                        lg:grid-cols-[1fr_520px]
                    "
                >
                    {/* LEFT */}

                    <div
                        className="
                            grid
                            gap-6
                            sm:grid-cols-2
                        "
                    >
                        {aiFeatures.map((feature) => (
                            <AICard
                                key={feature.title}
                                {...feature}
                            />
                        ))}
                    </div>

                    {/* RIGHT */}

                    <div
                        className="
                            relative
                            flex
                            justify-center
                            lg:justify-end
                        "
                    >
                        <AIPhone />
                    </div>

                </div>

            </Container>

        </section>
    );
}