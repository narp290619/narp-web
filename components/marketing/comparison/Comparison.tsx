import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import ComparisonRow from "./ComparisonRow";
import { comparisonData } from "./comparisonData";

export default function Comparison() {
    return (

        <section className="bg-white py-28">

            <Container>

                <SectionTitle
                    badge="Why NARP?"
                    title="A Better Way to Hire Trusted freelancers"
                    subtitle="NARP combines AI, identity verification, secure payments, and real-time technology into one platform."
                />

                <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 shadow-lg">

                    <div className="grid grid-cols-3 bg-slate-900 p-6 font-bold text-white">

                        <div></div>

                        <div className="text-center">
                            Traditional
                        </div>

                        <div className="text-center text-orange-400">
                            NARP
                        </div>

                    </div>

                    {comparisonData.map((row) => (

                        <ComparisonRow
                            key={row.title}
                            {...row}
                        />

                    ))}

                </div>

            </Container>

        </section>

    );
}