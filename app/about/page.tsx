import Image from "next/image";

export const metadata = {
  title: "About NARP",
  description:
    "Learn more about NARP (Nearby App for Reliable Professionals).",
};

const clientFeatures = [
  "Post job requests",
  "Find nearby professionals",
  "Hire verified freelancers",
  "Pay securely through the platform",
  "Track job progress",
  "Communicate with freelancers",
  "Submit ratings and reviews",
];

const freelancerFeatures = [
  "Accept job requests",
  "Communicate with clients",
  "Complete service bookings",
  "Build reputation through reviews",
  "Receive escrow-protected payments",
  "Use the NARP Wallet",
  "Withdraw earnings to your account",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="pt-24 mx-auto max-w-5xl px-5">

        {/* Hero */}

        <section className="rounded-3xl bg-gradient-to-br from-sky-200 to-blue-500 px-8 py-10 text-center shadow-lg">

          <Image
            src="/logos/narp.png"
            alt="NARP Logo"
            width={120}
            height={120}
            className="mx-auto"
            priority
          />

          <Image
            src="/logos/logo_shadow.png"
            alt="NARP"
            width={260}
            height={70}
            className="mx-auto mt-4"
          />

          <p className="mt-4 text-lg text-white/90">
            Nearby App for Reliable Professionals
          </p>

          <div className="mt-8 inline-block rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-6 py-3 font-semibold text-white shadow">
            Connecting Clients with Trusted Local Freelancers
          </div>
        </section>

        {/* About */}

        <SectionCard
          icon="ℹ️"
          title="About NARP"
          color="bg-blue-100"
        >
          <p className="leading-8 text-gray-600">
            NARP (Nearby App for Reliable Professionals) is a mobile
            marketplace platform that connects clients with trusted
            freelancers and skilled service providers in their local area.
          </p>

          <p className="mt-5 leading-8 text-gray-600">
            The platform helps clients find reliable freelancers while
            giving freelancers opportunities to grow their careers and earn
            income through a secure and transparent system.
          </p>

          <p className="mt-5 leading-8 text-gray-600">
            NARP provides job matching, secure communication,
            escrow-protected payments, wallet management, ratings,
            reviews, and withdrawal services to create a trusted
            experience for both clients and freelancers.
          </p>
        </SectionCard>

        {/* Client */}

        <FeatureCard
          title="For Clients"
          icon="👤"
          color="bg-blue-100"
          items={clientFeatures}
        />

        {/* Freelancer */}

        <FeatureCard
          title="For Freelancers"
          icon="💼"
          color="bg-green-100"
          items={freelancerFeatures}
        />

        {/* Escrow */}

        <SectionCard
          title="Escrow Protection"
          icon="🛡️"
          color="bg-orange-100"
        >
          <p className="font-semibold text-gray-700">
            NARP protects both clients and freelancers.
          </p>

          <div className="mt-6 space-y-3 text-gray-600">
            <p>• Client payment received</p>
            <p>• Funds held securely in escrow</p>
            <p>• Freelancer completes the work</p>
            <p>• Client confirms completion</p>
            <p>• Escrow payment released</p>
          </div>
        </SectionCard>

        {/* Wallet */}

        <SectionCard
          title="Wallet & Withdrawals"
          icon="💰"
          color="bg-green-100"
        >
          <div className="space-y-3 text-gray-600">
            <p>• Funds credited to the freelancer's NARP Wallet</p>
            <p>• Submit withdrawal requests</p>
            <p>• NARP reviews the request</p>
            <p>• Funds transferred to the registered account</p>
            <p>• Withdrawal completed</p>
          </div>
        </SectionCard>

        {/* Mission */}

        <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-10 text-center shadow">

          <div className="text-5xl">🚩</div>

          <h2 className="mt-5 text-3xl font-bold">
            Our Mission
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-600">
            To make it easier for people to find reliable freelancers
            nearby while providing freelancers with access to fair
            opportunities, secure payments, and a trusted marketplace
            for their services.
          </p>

        </section>

        {/* Footer */}

        <footer className="py-10 text-center text-gray-500">

          <p>Version 1.0.0</p>

          <p className="mt-2">
            © 2026 NARP — Nearby App for Reliable Professionals
          </p>

        </footer>

      </div>
    </main>
  );
}

function SectionCard({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow">

      <div className="mb-6 flex items-center gap-4">

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${color}`}
        >
          {icon}
        </div>

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
}

function FeatureCard({
  title,
  icon,
  color,
  items,
}: {
  title: string;
  icon: string;
  color: string;
  items: string[];
}) {
  return (
    <SectionCard title={title} icon={icon} color={color}>
      <ul className="space-y-4">

        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-gray-700"
          >
            <span className="font-bold text-green-600">✓</span>
            <span>{item}</span>
          </li>
        ))}

      </ul>
    </SectionCard>
  );
}