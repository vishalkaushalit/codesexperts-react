import Counter from '../../components/website/Counter';
import FaqSection from '../../components/website/FaqSection';
import PageBanner from '../../components/website/PageBanner';
import ServicesSlider from '../../components/website/ServicesSlider';
import Testimonials from '../../components/website/Testimonials';
import { ButtonLink, Container, H2, Lead, Section } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { AboutData } from '../../types/models';
import { publicAsset } from '../../utils/helpers';

const IMPACT = [
    ['Drive measurable growth', 'through smart digital strategies'],
    ['Build stronger online visibility', 'with SEO & marketing campaigns'],
    ['Simplify business operations', 'using scalable web & IT solutions'],
    ['Enhance user experiences', 'with creative UI/UX design'],
    ['Convert clicks into customers', 'with data-driven e-commerce solutions'],
] as const;

function FloatingImage({ src }: { src: string }) {
    return (
        <div data-aos="fade-up" data-aos-duration="2000">
            <img src={publicAsset(src)} alt="" className="w-full animate-float motion-reduce:animate-none" />
        </div>
    );
}

export default function About() {
    const { data } = useApi<AboutData>('/about');

    return (
        <>
            <PageBanner title="About Us" subtitle="India’s Trusted Multi-Sector Service Partner for Quality, Reliability & Excellence" />

            <Section>
                <Container className="grid items-center gap-6 md:grid-cols-2">
                    <FloatingImage src="assets/images/abt_img.webp" />
                    <div className="flex flex-col gap-2.5">
                        <H2>Who We Are</H2>
                        <Lead>
                            At CodesExperts, we go beyond traditional marketing and IT services by delivering end-to-end digital solutions tailored to
                            your business. Our expertise spans web development, digital marketing, SEO, UI/UX design, and e-commerce solutions, allowing
                            us to build a complete digital ecosystem that drives measurable growth. From stunning websites and intuitive designs to
                            powerful SEO campaigns and scalable e-commerce platforms, we combine innovation and strategy to help you unlock new
                            opportunities, generate quality leads, and achieve long-term success.
                        </Lead>
                        <ButtonLink to="/services" className="mt-6">
                            Read More
                        </ButtonLink>
                    </div>
                </Container>
            </Section>

            <Section>
                <Container>
                    <div className="grid items-center gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2.5">
                            <H2>The CodesExperts Impact</H2>
                            <Lead>
                                At CodesExperts, we believe impact is measured by the success of our clients. Over the years, we’ve partnered with growing
                                startups, established enterprises, and global brands to design and implement digital solutions that deliver real business
                                results. Our blend of technology, creativity, and strategy enables us to drive innovation, strengthen online presence, and
                                help businesses thrive in today’s competitive digital world.
                            </Lead>
                            <ul className="flex list-disc flex-col gap-2.5 pt-2.5 pl-5 marker:text-white">
                                {IMPACT.map(([bold, rest]) => (
                                    <li key={bold}>
                                        <Lead>
                                            <b className="font-bold text-brand">{bold}</b> {rest}
                                        </Lead>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <FloatingImage src="assets/images/codes_impact.webp" />
                    </div>
                    <Lead className="mt-6">
                        Every project we take on is more than just a service — it’s a partnership for growth. At CodesExperts, our mission is to create
                        a lasting digital impact that empowers businesses and engages their customers.
                    </Lead>
                </Container>
            </Section>

            <Counter />
            <ServicesSlider items={data?.services} />
            <Testimonials items={data?.testimonials} />
            <FaqSection />
        </>
    );
}
