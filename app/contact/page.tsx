export const metadata = {
  title: "Contact NARP",
  description:
    "Get in touch with the NARP team. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="pt-24 mx-auto max-w-6xl px-5">

        {/* Hero */}

        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-10 text-center text-white shadow-lg">

          <div className="text-6xl">📞</div>

          <h1 className="mt-5 text-4xl font-extrabold">
            Contact Us
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/90">
            Have a question, suggestion, or partnership inquiry?
            We'd love to hear from you.
          </p>

        </section>

        {/* Contact Cards */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <ContactCard
            icon="📧"
            title="Email"
            value="support@narp-svc.site"
          />

          <ContactCard
            icon="💬"
            title="Facebook"
            value="facebook.com/NARPPhilippines"
          />

          <ContactCard
            icon="🌐"
            title="Website"
            value="www.narp-svc.site"
          />

          <ContactCard
            icon="📍"
            title="Coverage"
            value="Philippines"
          />

        </div>

        {/* Contact Form */}

        <section className="mt-14 rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-3xl font-bold">
            Send Us a Message
          </h2>

          <p className="mt-3 text-gray-600">
            We'll get back to you as soon as possible.
          </p>

          <form className="mt-8 space-y-6">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-xl border p-4"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-xl border p-4"
            />

            <textarea
              rows={6}
              placeholder="Your Message"
              className="w-full rounded-xl border p-4"
            />

            <button
              type="submit"
              className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Send Message
            </button>

          </form>

        </section>

        {/* FAQ */}

        <section className="mt-14 rounded-3xl bg-blue-50 p-8 shadow">

          <h2 className="text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-6">

            <FAQ
              question="How do I become a freelancer?"
              answer="Download the NARP mobile app, create an account, verify your identity, and complete your freelancer profile."
            />

            <FAQ
              question="How are payments protected?"
              answer="Payments are securely held in escrow until the client confirms the job has been completed."
            />

            <FAQ
              question="Which areas does NARP support?"
              answer="NARP is designed for users throughout the Philippines."
            />

          </div>

        </section>

      </div>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-gray-600">
        {value}
      </p>

    </div>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6">

      <h3 className="font-bold">
        {question}
      </h3>

      <p className="mt-3 text-gray-600">
        {answer}
      </p>

    </div>
  );
}