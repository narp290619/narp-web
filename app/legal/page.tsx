import LegalList from "@/components/legal/LegalList";
import LegalPolicyGrid from "@/components/legal/LegalPolicyGrid";
import { policies } from "@/lib/legal/policies";

export const metadata = {
  title: "Legal Center | NARP",
  description:
    "Legal policies, terms, and guidelines for using NARP.",
};

export default function LegalCenterPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl px-5 pt-24">

        {/* Hero */}

        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-10 text-center text-white shadow-lg">

          <div className="text-6xl">
            ⚖️
          </div>

          <h1 className="mt-5 text-4xl font-extrabold">
            Legal Center
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/90">
            Find all legal policies, terms, and important information
            regarding your use of NARP.
          </p>

        </section>

        {/* Policies */}

        <div className="mt-12">
          <LegalPolicyGrid policies={policies} />
        </div>

      </div>
    </main>
  );
}