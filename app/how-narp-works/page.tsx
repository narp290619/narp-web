export const metadata = {
  title: "How NARP Works",
  description:
    "Learn how NARP securely connects clients and freelancers through escrow-protected payments.",
};

const steps = [
  {
    number: 1,
    icon: "📝",
    title: "Client Posts a Job",
    description:
      "Clients create a service request describing the work they need and wait for qualified freelancers to respond.",
  },
  {
    number: 2,
    icon: "👷",
    title: "Freelancer Accepts",
    description:
      "Verified freelancers review the request, accept the job, and confirm their availability.",
  },
  {
    number: 3,
    icon: "💳",
    title: "Secure Payment",
    description:
      "The client pays securely through NARP before work begins.",
  },
  {
    number: 4,
    icon: "🛡️",
    title: "Funds Held in Escrow",
    description:
      "Payment is safely held in escrow to protect both the client and the freelancer.",
  },
  {
    number: 5,
    icon: "🔧",
    title: "Job Completed",
    description:
      "The freelancer performs the requested service and marks the booking as completed.",
  },
  {
    number: 6,
    icon: "✅",
    title: "Client Confirms",
    description:
      "The client reviews the completed work and confirms successful delivery.",
  },
  {
    number: 7,
    icon: "💰",
    title: "Escrow Released",
    description:
      "Once approved, NARP releases the escrow payment to the freelancer's wallet.",
  },
  {
    number: 8,
    icon: "⭐",
    title: "Rate & Review",
    description:
      "Both client and freelancer can leave ratings and reviews to help build a trusted community.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="pt-24 mx-auto max-w-5xl px-5">

        {/* Hero */}

        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-sky-400 p-10 text-center text-white shadow-lg">

          <div className="text-6xl">🛡️</div>

          <h1 className="mt-5 text-4xl font-extrabold">
            How NARP Works
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/90">
            NARP securely connects clients and freelancers through
            verified accounts, escrow-protected payments, secure
            communication, and transparent job tracking.
          </p>

        </section>

        {/* Timeline */}

        <section className="mt-12">

          <h2 className="mb-10 text-center text-3xl font-bold">
            Service & Payment Flow
          </h2>

          <div className="relative ml-6 border-l-4 border-blue-200">

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative mb-8 ml-8"
              >
                <div className="absolute -left-[58px] flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl text-white shadow-lg">
                  {step.number}
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">

                  <div className="flex items-center gap-4">

                    <div className="text-4xl">
                      {step.icon}
                    </div>

                    <div>

                      <h3 className="text-xl font-bold">
                        {step.title}
                      </h3>

                      <p className="mt-2 leading-7 text-gray-600">
                        {step.description}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* Information Cards */}

        <div className="mt-14 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8 shadow">

            <div className="text-4xl">🛡️</div>

            <h2 className="mt-4 text-2xl font-bold">
              Escrow Protection
            </h2>

            <p className="mt-4 leading-8 text-gray-700">
              Every payment is securely held until the client confirms
              that the work has been completed successfully.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>✓ Secure payment collection</li>
              <li>✓ Funds safely held in escrow</li>
              <li>✓ Released only after approval</li>
            </ul>

          </div>

          <div className="rounded-3xl border border-green-200 bg-green-50 p-8 shadow">

            <div className="text-4xl">💰</div>

            <h2 className="mt-4 text-2xl font-bold">
              Wallet & Withdrawals
            </h2>

            <p className="mt-4 leading-8 text-gray-700">
              Once escrow is released, earnings are credited to the
              freelancer's NARP Wallet and can be withdrawn securely.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>✓ Wallet credited instantly</li>
              <li>✓ Withdrawal request submitted</li>
              <li>✓ Admin verification</li>
              <li>✓ GCash or bank transfer</li>
            </ul>

          </div>

        </div>

        {/* Why Choose NARP */}

        <section className="mt-14 rounded-3xl bg-white p-10 shadow">

          <h2 className="text-center text-3xl font-bold">
            Why Choose NARP?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon="✔️"
              title="Verified Freelancers"
              description="Work with trusted and verified service providers."
            />

            <FeatureCard
              icon="💬"
              title="Secure Messaging"
              description="Communicate safely before, during, and after every booking."
            />

            <FeatureCard
              icon="📍"
              title="Nearby Services"
              description="Discover freelancers close to your location."
            />

            <FeatureCard
              icon="⭐"
              title="Ratings & Reviews"
              description="Build trust through transparent customer feedback."
            />

          </div>

        </section>

        {/* CTA */}

        <section className="mt-14 rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 p-10 text-center text-white shadow-lg">

          <h2 className="text-3xl font-bold">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Whether you're looking for reliable freelancers or want
            to earn by offering your skills, NARP makes the process
            simple, secure, and transparent.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <a
              href="/freelancer"
              className="rounded-full bg-white px-8 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Find a Freelancer
            </a>

            <a
              href="/signup"
              className="rounded-full border border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-blue-700"
            >
              Become a Freelancer
            </a>

          </div>

        </section>

      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 text-center">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}