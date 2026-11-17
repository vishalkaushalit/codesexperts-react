import RichText from '../../components/common/RichText';
import FaqSection from '../../components/website/FaqSection';
import PageBanner from '../../components/website/PageBanner';
import { Card, CardTitle, Container, H2, Lead, Section, SectionIntro } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { WebDevelopmentData } from '../../types/models';
import { publicAsset, stripTags, uploadUrl } from '../../utils/helpers';

const FEATURES = [
    'SEO-friendly URL structure',
    'Fast page load speeds',
    'Social media integration',
    'Lead generation forms & tools',
    'Chatbot & WhatsApp connectivity',
    'API integrations',
    'Interactive design elements',
    'Cloud hosting & admin panels',
];

const PROCESS = [
    ['research', 'Research', "We start by fully understanding your company's goals, your potential customers, and your required functions."],
    ['design', 'Design', 'We design very intuitive user interfaces that focus greatly on engagement, accessibility, and conversion.'],
    ['development', 'Development', 'With the latest technology tools, our developers take your designs and turn them into completely functional websites.'],
    ['testing', 'Testing', 'Every site goes through thorough testing - across a range of devices and browsers - so that it performs flawlessly.'],
    ['launch', 'Launch', 'Once all approvals are finalised, we will deploy your website onto a highly secure and fast hosting environment.'],
    ['support', 'Support', "We'll be here available for maintenance, updates, and monitoring performance of the website even after launch."],
] as const;

export default function WebDevelopment() {
    const { data } = useApi<WebDevelopmentData>('/services/web-development');
    const webServices = data?.webServices ?? [];
    const technologies = data?.webTechnologies ?? [];

    return (
        <>
            <PageBanner
                title="Web Development"
                subtitle="Codesexperts builds unique, highly secure, and performing well-designed websites perfectly suited to business requirements."
            />

            <Section>
                <Container>
                    <div className="flex flex-col gap-2.5 text-center">
                        <H2>Professional Web Development Solutions - Build Your Digital Success</H2>
                        <Lead>
                            In today's digitally driven world, your website really is the face of your business online. Whether it's a brand new
                            startup, a small firm, or a global corporation, having a powerful, very user-friendly, and search engine optimized website is
                            really essential indeed. If you're looking for a trustworthy web development solution, your search actually ends at
                            Codesexperts, a leading Web Development Solution specialising in building modern, secure, and high-performance websites that
                            help businesses both grow and stand out online greatly. Our team blends our creativity, technology, and strategic planning
                            perfectly to deliver websites that look not only incredibly impressive but also deliver measurable results very clearly.
                            <br />
                            <br />
                            Welcome to a top web development solution where creativity really meets technology - and your business goals actually become
                            a digital reality. With many years of deep experience, innovative strategies, and a very client-focused approach indeed, we
                            help brands both grow and thrive online all the time.
                        </Lead>
                    </div>
                </Container>
            </Section>

            <section>
                <Container className="grid items-center gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-2.5">
                        <H2>Who We Are</H2>
                        <Lead>
                            We offer a very trusted web development solution, focused on making highly performing, very secure, and scalable websites -
                            which really boost your online presence itself. With over 3 years of experience now, our team really combines imagination
                            with extensive technical expertise - delivering very customised web solutions that really match your business goals and what
                            your customers actually need.
                            <br />
                            <br />
                            We don't just build websites; we make engaging digital experiences - helping your business stand out much more, win lots more
                            traffic, and turn visitors into actual customers itself.
                        </Lead>
                    </div>
                    <img src={publicAsset('assets/images/who_we_are.webp')} alt="" className="w-full" loading="lazy" />
                </Container>
            </section>

            <Section>
                <Container>
                    <SectionIntro title="Our Web Development Services" />
                    <div className="mt-7 flex flex-wrap justify-center gap-6">
                        {webServices.map((s) => (
                            <div key={s.id} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]">
                                <Card className="min-h-0 md:min-h-[250px]">
                                    <img src={uploadUrl(s.image)} alt="" className="w-max max-w-full rounded-md" loading="lazy" />
                                    <CardTitle className="lg:text-[22px]/8 xl:text-2xl/8">{stripTags(s.heading)}</CardTitle>
                                    <RichText html={s.description} className="text-sm/5" />
                                </Card>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            <section>
                <Container>
                    <SectionIntro title="Advanced Features That Really Set Your Website Apart" />
                    <div className="mt-7 flex flex-wrap justify-center gap-6">
                        {FEATURES.map((f) => (
                            <div key={f} className="w-full md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]">
                                <Card className="min-h-[100px] items-center justify-center text-center">
                                    <CardTitle>{f}</CardTitle>
                                </Card>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <Section>
                <Container>
                    <SectionIntro title="Our Web Development Process" />
                    <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {PROCESS.map(([image, title, text]) => (
                            <div key={image} className="flex flex-col items-center gap-2.5 text-center">
                                <img src={publicAsset(`assets/images/${image}.webp`)} alt="" loading="lazy" />
                                <h3 className="text-2xl/8 text-white">{title}</h3>
                                <p className="text-white">{text}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            <section>
                <Container>
                    <SectionIntro title="Technologies We Use" />
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
                        {technologies.map((t) => (
                            <div key={t.id} className="w-full text-center md:w-[calc((100%-7.5rem)/6)]">
                                <img src={uploadUrl(t.image)} alt="" width={60} className="mx-auto" loading="lazy" />
                                <p className="mt-2 text-sm font-bold text-slate-400">{t.heading}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <FaqSection variant="services" />
        </>
    );
}
