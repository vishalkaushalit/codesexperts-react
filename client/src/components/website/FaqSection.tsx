import Accordion from '../common/Accordion';
import { generalFaq, servicesFaq } from '../../data/faq';
import { Container, Section, SectionIntro } from './ui';

/** variant: "general" (About page) or "services" (service pages). */
export default function FaqSection({ variant = 'general' }: { variant?: 'general' | 'services' }) {
    return (
        <Section>
            <Container>
                <SectionIntro title="Frequently Asked Questions" />
                <Accordion items={variant === 'services' ? servicesFaq : generalFaq} />
            </Container>
        </Section>
    );
}
