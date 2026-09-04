import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import CoverageMap from "./CoverageMap";
import CoverageStat from "./CoverageStat";

export default function Coverage() {
    return (
        <section
            id="coverage"
            className="bg-slate-50 py-32">

            <Container>

                <SectionTitle
                    badge="Coverage"
                    title="The Largest Growing Freelancer Network in the Philippines."
                    subtitle="NARP is building the country's largest network of trusted freelancers."
                />

                <div className="mt-20">

                    <CoverageMap />

                </div>

                <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                    <CoverageStat
                        icon="👷"
                        value={10000}
                        suffix="+"
                        title="Verified Freelancers"
                    />

                    <CoverageStat
                        icon="🛠️"
                        value={150}
                        suffix="+"
                        title="Skills"
                    />

                    <CoverageStat
                        icon="📍"
                        value={81}
                        title="Provinces"
                    />

                    <CoverageStat
                        icon="⭐"
                        value={4.9}
                        title="Average Rating"
                    />

                </div>

            </Container>
        </section>
    );
}