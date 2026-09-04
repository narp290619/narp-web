import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

import StepCard from "./StepCard"
import { steps } from "./steps"
import FadeUp from "@/components/animations/FadeUp"

export default function How() {
  return (
    <section className="bg-white py-28">
      <Container>
        <FadeUp>
          <SectionTitle
            badge="How It Works"
            title="Getting Things Done Has Never Been Easier"
            subtitle="Hire trusted freelancers in just three simple steps."
          />
        </FadeUp>

        <div className="mt-20 grid gap-10 lg:grid-cols-3">
          {steps.map((step, index) => (
            <FadeUp
              key={step.number}
              delay={index * 0.08}
            >
              <StepCard
                key={step.number}
                {...step}
              />
            </FadeUp>
          ))}
        </div>

      </Container>
    </section>
  )
}