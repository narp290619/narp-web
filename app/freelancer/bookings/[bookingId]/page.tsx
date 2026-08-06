import PageContainer from "@/components/shared/PageContainer";
import Container from "@/components/shared/Container";
import FreelancerBookingClient from "@/components/freelancers/booking/FreelancerBookingClient";


interface Props {
    params: Promise<{
        bookingId: string;
    }>;
}

export default async function FreelancerBookingPage({
    params,
}: Props) {

    const { bookingId } = await params;

    return (
        <PageContainer>
            <Container>

                <FreelancerBookingClient
                    bookingId={bookingId}
                />

            </Container>
        </PageContainer>
    );
}