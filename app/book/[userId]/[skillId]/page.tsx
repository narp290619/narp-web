import { notFound } from "next/navigation";

import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

import BookingWizard from "@/components/booking/BookingWizard";

import { getMember } from "@/repositories/skill-member.repository";
import BookingAuthGuard from "@/components/booking/BookingAuthGuard";

interface Props {
    params: Promise<{
        userId: string;
        skillId: string;
    }>;
}

export default async function BookingPage({
    params,
}: Props) {

    const {
        userId,
        skillId,
    } = await params;

    const member = await getMember(
        userId,
        skillId,
    );

    if (!member) {

        notFound();

    }

    return (

        <PageContainer>

            <Container>

                <BookingAuthGuard>

                    <BookingWizard
                        freelancer={member}
                    />

                </BookingAuthGuard>

            </Container>

        </PageContainer>

    );

}