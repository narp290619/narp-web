
import type { SkillMember } from "@/lib/models/skill-member";
import FreelancerCard from "../services/detail/FreelancerCard";

interface Props {
    members: SkillMember[];
}

export default function SimilarFreelancers({
    members,
}: Props) {

    if (members.length === 0) {

        return null;

    }

    return (

        <section className="mt-24">

            <div className="mb-10">

                <h2 className="text-3xl font-bold">

                    Similar Freelancers

                </h2>

                <p className="mt-2 text-slate-500">

                    Explore other highly rated freelancers offering the same service.

                </p>

            </div>

            <div
                className="
                    grid
                    gap-8

                    md:grid-cols-2
                    xl:grid-cols-3
                "
            >

                {members.map((member) => (

                    <FreelancerCard
                        key={member.id}
                        freelancer={member}
                    />

                ))}

            </div>

        </section>

    );

}