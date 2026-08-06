import PageContainer from "@/components/shared/PageContainer";
import Container from "@/components/shared/Container";
import LeaveReviewClient from "./LeaveReviewClient";

interface Props {
    params: Promise<{
        bookingId: string;
    }>;
}

export default async function ReviewPage({
    params,
}: Props) {

    const { bookingId } = await params;

    return (
        <PageContainer>
            <Container>
                <LeaveReviewClient
                    bookingId={bookingId}
                />
            </Container>
        </PageContainer>
    );
}