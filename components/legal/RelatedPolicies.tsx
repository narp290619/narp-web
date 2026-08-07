import Link from "next/link";
import { policies } from "@/lib/legal/policies";

type Props = {
  current: string;
};

export default function RelatedPolicies({ current }: Props) {
  const currentPolicy = policies.find(
    (policy) => policy.href === current
  );

  if (!currentPolicy?.related?.length) {
    return null;
  }

  const related = policies.filter((policy) =>
    currentPolicy.related!.includes(policy.href)
  );

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">
        Related Policies
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {related.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
          >
            <div className="text-3xl">{policy.icon}</div>

            <h3 className="mt-3 font-semibold">
              {policy.title}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {policy.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}