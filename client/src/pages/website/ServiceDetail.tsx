import FaqSection from '../../components/website/FaqSection';
import PageBanner from '../../components/website/PageBanner';

/** Simple service pages (digital marketing, UI/UX, e-commerce, video editing). */
export default function ServiceDetail({ title, subtitle = 'Multi-sector expertise, nationwide reach' }: { title: string; subtitle?: string }) {
    return (
        <>
            <PageBanner title={title} subtitle={subtitle} />
            <FaqSection variant="services" />
        </>
    );
}
