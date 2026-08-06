import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

import BookingDetailsClient from "@/components/booking/BookingDetailsClient";

interface Props {
    params: Promise<{
        bookingId: string;
    }>;
}

export default async function BookingDetailsPage({
    params,
}: Props) {
    const { bookingId } = await params;

    return (
        <PageContainer>
            <Container>
                <BookingDetailsClient
                    bookingId={bookingId}
                />
            </Container>
        </PageContainer>
    );
}