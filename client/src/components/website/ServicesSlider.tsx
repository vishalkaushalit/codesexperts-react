import { Link } from 'react-router-dom';
import Carousel from '../common/Carousel';
import type { Service } from '../../types/models';
import { uploadUrl } from '../../utils/helpers';
import { Container, Section, SectionIntro } from './ui';

export default function ServicesSlider({ items = [] }: { items?: Service[] }) {
    return (
        <Section>
            <Container>
                <SectionIntro title="Our Services" text="“Innovative, scalable, and impact-driven services for every business.”" />
                {items.length > 0 && (
                    <Carousel className="mt-12">
                        {items.map((s) => (
                            <Link key={s.id} to={`/services/${s.slug}`} className="group block">
                                <img src={uploadUrl(s.image)} className="w-full" alt="" loading="lazy" />
                                <p className="mt-4 text-center text-white transition-colors group-hover:text-brand">{s.heading}</p>
                            </Link>
                        ))}
                    </Carousel>
                )}
            </Container>
        </Section>
    );
}
