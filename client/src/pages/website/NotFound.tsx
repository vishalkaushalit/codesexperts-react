import PageBanner from '../../components/website/PageBanner';
import { ButtonLink, Container, Section } from '../../components/website/ui';

export default function NotFound() {
    return (
        <>
            <PageBanner title="Page Not Found" subtitle="The page you’re looking for doesn’t exist or has moved." />
            <Section>
                <Container>
                    <ButtonLink to="/" className="mx-auto">
                        Back to Home
                    </ButtonLink>
                </Container>
            </Section>
        </>
    );
}
