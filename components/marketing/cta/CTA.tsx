import Link from "next/link"

import Container from "@/components/shared/Container"
import FadeUp from "@/components/animations/FadeUp"

export default function CTA() {
    return (
        <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-24">
            <Container>
                <FadeUp>
                    <div className="mx-auto max-w-4xl text-center">

                        <h2 className="text-4xl font-bold text-white lg:text-5xl">
                            Ready to Hire or Offer Your Skills?
                        </h2>

                        <p className="mt-6 text-lg text-orange-100">
                            Join thousands of Filipinos using NARP to find trusted freelancers
                            and grow their businesses.
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">

                            <Link
                                href="#"
                                className="rounded-xl bg-white px-8 py-4 font-semibold text-orange-600 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                Download App
                            </Link>

                            <Link
                                href="#"
                                className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-600"
                            >
                                Become a Freelancer
                            </Link>

                        </div>

                    </div>
                </FadeUp>

            </Container>
        </section>
    )
}