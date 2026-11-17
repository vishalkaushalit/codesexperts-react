import RichText from '../../components/common/RichText';
import FaqSection from '../../components/website/FaqSection';
import PageBanner from '../../components/website/PageBanner';
import { ButtonLink, Container, H2 } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { ServicesData } from '../../types/models';
import { cn, uploadUrl } from '../../utils/helpers';

export default function Services() {
    const { data } = useApi<ServicesData>('/services');
    const services = data?.services ?? [];

    return (
        <>
            <PageBanner title="Services" subtitle="Multi-sector expertise, nationwide reach" />

            <section className="py-12">
                <Container>
                    {services.map((service, i) => (
                        <div key={service.id} className={cn('my-6 flex flex-col items-center gap-6 md:flex-row', i % 2 === 1 && 'md:flex-row-reverse')}>
                            <div className="w-full md:w-5/12" data-aos="fade-up" data-aos-duration="2000">
                                <img src={uploadUrl(service.image)} className="w-full rounded-md" alt="" loading="lazy" />
                            </div>
                            <div className="w-full md:w-7/12">
                                <div className="flex flex-col gap-2.5">
                                    <H2>{service.heading}</H2>
                                    <RichText html={service.description} />
                                </div>
                                <ButtonLink to={`/services/${service.slug}`} aria-label={`Read more about ${service.heading}`} className="mt-6">
                                    Read More
                                </ButtonLink>
                            </div>
                        </div>
                    ))}
                </Container>
            </section>

            <FaqSection variant="services" />
        </>
    );
}
