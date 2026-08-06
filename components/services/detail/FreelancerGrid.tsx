import { SkillMember } from "@/lib/models/skill-member";
import FreelancerCard from "./FreelancerCard";

interface Props {
    members: SkillMember[];
}

export default function FreelancerGrid({
    members,
}: Props) {

    if (members.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">

                <h3 className="text-2xl font-bold">
                    No freelancers yet
                </h3>

                <p className="mt-3 text-slate-500">
                    Be the first freelancer to offer this service.
                </p>

            </div>
        );
    }

    return (

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {members.map((member) => (

                <FreelancerCard
                    key={member.userId}
                    freelancer={member}
                />

            ))}

        </div>

    );

}