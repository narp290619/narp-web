import { notFound } from "next/navigation";

import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

import FreelancerHero from "@/components/freelancers/FreelancerHero";
import FreelancerOverview from "@/components/freelancers/FreelancerOverview";
import FreelancerSidebar from "@/components/freelancers/FreelancerSidebar";

import { getMember, getSimilarMembers } from "@/repositories/skill-member.repository";
import { getFreelancerReviews } from "@/repositories/review.repository";
import SimilarFreelancers from "@/components/freelancers/SimilarFreelancers";

interface Props {
    params: Promise<{
        userId: string;
        skillId: string;
    }>;
}

export default async function FreelancerPage({
    params,
}: Props) {

    const { userId, skillId } = await params;

    const member = await getMember(
        userId,
        skillId,
    );

    const similarMembers =
        await getSimilarMembers(
            skillId,
            userId,
        );

    if (!member) {
        notFound();
    }

    const reviews = await getFreelancerReviews(
        userId,
        skillId,
    );

    return (

        <PageContainer>

            <Container>

                <FreelancerHero
                    member={member}
                />

                <div
                    className="
                        mt-10
                        grid
                        gap-10
                        lg:grid-cols-[2fr_400px]
                    "
                >

                    <FreelancerOverview
                        member={member}
                        reviews={reviews}
                    />

                    <FreelancerSidebar
                        member={member}
                    />

                </div>

                <div className="mt-20">

                    <SimilarFreelancers
                        members={similarMembers}
                    />

                </div>

            </Container>

        </PageContainer>

    );

}