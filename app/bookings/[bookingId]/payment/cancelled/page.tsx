import PageContainer from "@/components/shared/PageContainer";
import Container from "@/components/shared/Container";
import PaymentCancelledClient from "./PaymentCancelledClient";


interface Props {

    params: Promise<{
        bookingId: string;
    }>;

}

export default async function PaymentCancelledPage({

    params,

}: Props) {

    const { bookingId } = await params;

    return (

        <PageContainer>

            <Container>

                <PaymentCancelledClient
                    bookingId={bookingId}
                />

            </Container>

        </PageContainer>

    );

}