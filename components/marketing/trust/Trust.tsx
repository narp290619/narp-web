import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import TrustCard from "./TrustCard";
import { trustFeatures } from "./trustFeatures";

export default function Trust() {
  return (
    <section className="bg-slate-50 py-28">

      <Container>

        <SectionTitle
          badge="Trust & Security"
          title="Built with Safety, Transparency, and Trust"
          subtitle="Every booking is backed by intelligent verification, secure payments, and technologies designed to protect both clients and freelancers."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {trustFeatures.map((feature) => (
            <TrustCard
              key={feature.title}
              {...feature}
            />
          ))}

        </div>

      </Container>
    </section>
  );
}