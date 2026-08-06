import Container from "@/components/shared/Container";

export default function PageContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="pt-28 pb-24">
            <Container>
                {children}
            </Container>
        </section>
    );
}