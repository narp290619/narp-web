import PageContainer from "@/components/shared/PageContainer";
import Container from "@/components/shared/Container";
import PaymentPageClient from "./PaymentPageClient";


interface Props {
    params: Promise<{
        bookingId: string;
    }>;
}

export default async function PaymentPage({
    params,
}: Props) {

    const { bookingId } = await params;

    return (
        <PageContainer>
            <Container>
                <PaymentPageClient
                    bookingId={bookingId}
                />
            </Container>
        </PageContainer>
    );
}