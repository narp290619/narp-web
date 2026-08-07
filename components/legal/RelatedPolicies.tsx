import Link from "next/link";

import {
    policies,
    relatedPolicies,
} from "@/lib/legal/policies";

type Props = {
    current: string;
};

export default function RelatedPolicies({
    current,
}: Props) {

    const related = (relatedPolicies[current] ?? [])
        .map((href) =>
            policies.find((policy) => policy.href === href)
        )
        .filter(Boolean);

    if (related.length === 0) {
        return null;
    }

    return (

        <section className="rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="text-2xl font-bold">

                Related Policies

            </h2>

            <p className="mt-3 text-gray-600">

                These documents may also help answer your
                questions.

            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

                {related.map((policy) => (

                    <Link
                        key={policy!.href}
                        href={policy!.href}
                        className="
                            rounded-2xl
                            border
                            bg-gray-50
                            p-5
                            transition
                            hover:border-blue-500
                            hover:bg-blue-50
                        "
                    >

                        <div className="text-3xl">

                            {policy!.icon}

                        </div>

                        <h3 className="mt-4 font-bold">

                            {policy!.title}

                        </h3>

                    </Link>

                ))}

            </div>

        </section>

    );

}