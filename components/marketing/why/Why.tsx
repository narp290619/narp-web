import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

import FeatureCard from "./FeatureCard"
import { features } from "./features"
import FadeUp from "@/components/animations/FadeUp"

export default function Why() {
  return (
    <section className="bg-slate-50 py-28">
      <Container>
        <FadeUp>
          <SectionTitle
            badge="Why Choose NARP?"
            title="Everything You Need to Hire with Confidence"
            subtitle="Built to make finding trusted freelancers simple, fast, and secure."
          />
        </FadeUp>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeUp
              key={feature.title}
              delay={index * 0.08}
            >
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  )
}