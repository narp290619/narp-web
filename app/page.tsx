import Navbar from "@/components/marketing/navbar/Navbar"
import Hero from "@/components/marketing/hero/Hero"
import Why from "@/components/marketing/why/Why"
import How from "@/components/marketing/how/How"
import Showcase from "@/components/marketing/showcase/Showcase"
import Testimonials from "@/components/marketing/testimonials/Testimonials"
import CTA from "@/components/marketing/cta/CTA"
import Download from "@/components/marketing/download/Download";
import Coverage from "@/components/marketing/coverage/Coverage";
import Trust from "@/components/marketing/trust/Trust";
import AISection from "@/components/marketing/ai/AISection";
import FAQ from "@/components/marketing/faq/FAQ";
import Footer from "@/components/marketing/footer/Footer"
import Services from "@/components/marketing/services/Services"

export default function HomePage() {
  return (
    <>
      {/* <Navbar /> */}

      <Hero />
      <Services />
      <Why />
      <How />
      <Showcase />
      <Testimonials />
      <Download />
      <Coverage />
      <Trust />
      <AISection />
      <CTA />

      <FAQ />
      {/* <Footer /> */}
    </>
  )
}