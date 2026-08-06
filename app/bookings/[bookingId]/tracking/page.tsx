import TrackingClient from "./TrackingClient";

interface Props {
    params: Promise<{
        bookingId: string;
    }>;
}

export default async function TrackingPage({
    params,
}: Props) {

    const { bookingId } = await params;

    return (
        <TrackingClient
            bookingId={bookingId}
        />
    );
}