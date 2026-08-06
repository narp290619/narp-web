import FadeUp from "@/components/animations/FadeUp";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialsData";

export default function Testimonials() {
    return (
        <section className="bg-slate-50 py-28">

            <Container>

                <FadeUp>

                    <SectionTitle
                        badge="Trusted by the Community"
                        title="Real Experiences from Clients and Freelancers"
                        subtitle="See how NARP is helping people hire trusted freelancers and grow their businesses across the Philippines."
                    />

                </FadeUp>

                <div
                    className="
                        mt-20
                        grid
                        gap-8
                        lg:grid-cols-3
                    "
                >

                    {testimonials.map((testimonial, index) => (

                        <TestimonialCard
                            key={testimonial.name}
                            {...testimonial}
                            className={
                                index === 1
                                    ? "lg:mt-8"
                                    : ""
                            }
                        />

                    ))}

                </div>

            </Container>

        </section>
    );
}