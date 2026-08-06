import PageContainer from "@/components/shared/PageContainer";
import Container from "@/components/shared/Container";
import PaymentSuccessClient from "./PaymentSuccessClient";

interface Props {
    params: Promise<{
        bookingId: string;
    }>;
}

export default async function PaymentSuccessPage({
    params,
}: Props) {

    const { bookingId } = await params;

    return (
        <PageContainer>
            <Container>
                <PaymentSuccessClient
                    bookingId={bookingId}
                />
            </Container>
        </PageContainer>
    );
}