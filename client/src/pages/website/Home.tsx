import Testimonials from '../../components/website/Testimonials';
import { ButtonLink, Card, CardTitle, Container, Decor, H2, Lead, Section } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { HomeData, Logo } from '../../types/models';
import { cn, publicAsset, uploadUrl } from '../../utils/helpers';

const img = (name: string) => publicAsset(`assets/images/${name}`);

const OFFERS = [
    {
        wide: true,
        icon: 'web_development',
        title: 'Web development',
        to: '/services/web-development',
        sr: 'about Web Development services',
        text: 'We build high-performing websites and custom web applications using modern technologies like React, Next.js, and Node.js. Our solutions are fast, secure, and scalable — designed to help your business grow online.',
    },
    {
        wide: true,
        icon: 'digital_marketing',
        title: 'Digital Marketing (SEO & SMO)',
        to: '/services/digital-marketing',
        sr: 'about Digital Marketing, SEO, and SMO services',
        text: 'We provide result-oriented SEO and SMO strategies to increase your visibility, generate leads, and build authority online. From keyword optimization to social engagement, we make sure your brand reaches the right audience.',
    },
    {
        icon: 'ui_ux',
        title: 'UI/UX Designing',
        to: '/services/ui-ux-design',
        sr: 'about UI/UX Designing services',
        text: 'We craft intuitive and user-friendly designs that enhance customer experience. Our wireframes, prototypes, and creative interfaces ensure your brand not only looks great but also delivers smooth usability.',
    },
    {
        icon: 'e_commerce',
        title: 'E-Commerce Solutions',
        to: '/services/ecommerce-solutions',
        sr: 'about E-Commerce Solutions',
        text: 'From Shopify to WooCommerce and custom-built platforms, we create e-commerce stores that deliver seamless shopping experiences, integrated payments, and optimized performance to maximize your sales.',
    },
    {
        icon: 'video_editing',
        title: 'Video Editing & Motion Graphics',
        to: '/services/video-editing-and-motion-graphics',
        sr: 'about Video Editing and Motion Graphics',
        text: 'Engage your audience with professional video editing, animations, and motion graphics. From social media reels to corporate videos, we create impactful visuals that bring your ideas to life.',
    },
];

function Marquee({ items = [], direction }: { items?: Logo[]; direction: 'left' | 'right' }) {
    const logos = items.filter((i) => i.image);
    if (!logos.length) return null;
    return (
        <div className="group mt-12 w-full overflow-hidden">
            <div
                className={cn(
                    'flex w-max gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none',
                    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
                )}
            >
                {[...logos, ...logos].map((item, i) => (
                    <img
                        key={`${item.id}-${i}`}
                        src={uploadUrl(item.image)}
                        className="mx-3 max-w-none"
                        alt={i < logos.length ? item.heading : ''}
                        title={item.heading}
                        aria-hidden={i >= logos.length || undefined}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const { data } = useApi<HomeData>('/home');

    return (
        <>
            {/* Hero */}
            <section
                className={cn(
                    'relative isolate h-[500px] overflow-hidden bg-(image:--hero) bg-cover bg-right bg-no-repeat py-[70px] sm:h-[530px] md:h-[500px] md:bg-left xl:h-[565px]',
                    '2xl:h-[700px] 2xl:bg-(image:--hero-wide) 2xl:bg-center 3xl:h-[45vh]',
                )}
                style={{ ['--hero' as string]: `url(${img('home_bg.webp')})`, ['--hero-wide' as string]: `url(${img('home_bg2.webp')})` }}
            >
                <Decor
                    src={img('icons/marble.webp')}
                    className="top-[30%] left-[5%] hidden size-[70px] animate-spin-slow sm:block md:top-[24%] md:left-[42%] lg:top-1/4 lg:left-[40%] lg:size-[100px]"
                />
                <Decor
                    src={img('icons/marble.webp')}
                    className="-right-[5%] -bottom-[20%] hidden size-[200px] animate-spin-slower object-contain sm:block xl:size-[250px] 2xl:size-[400px] 3xl:-bottom-[250px] 3xl:size-[500px]"
                />
                <Container className="h-full">
                    <div className="mt-6 grid h-full items-center gap-6 md:grid-cols-2">
                        <div className="md:col-start-2">
                            <div className="flex flex-col gap-2.5">
                                <h1 className="text-[30px]/[40px] font-medium text-white capitalize lg:text-[40px]/[50px] 2xl:text-[65px]/[80px]">
                                    Websites & AI Solutions That Grow Your{' '}
                                    <span className="text-gradient text-[50px]/[60px] sm:text-[60px]/[60px] lg:text-[70px]/[70px] 2xl:text-[88px]/[80px]">
                                        Business
                                    </span>
                                </h1>
                                <Lead>
                                    We build high-performance websites, mobile apps, AI systems, and digital platforms for startups and businesses worldwide.
                                </Lead>
                            </div>
                            <div className="items-center gap-4 md:flex">
                                <ButtonLink to="/contact" className="mt-6">
                                    Book Free Consultation
                                </ButtonLink>
                                <ButtonLink to="/projects" className="mt-6">
                                    View Our Work
                                </ButtonLink>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Trusted by */}
            <Section className="overflow-hidden">
                <Container className="grid gap-6 md:grid-cols-2">
                    <H2>Trusted by 100+ companies around the world</H2>
                    <Lead>
                        Over the years, CodesExperts has partnered with startups, enterprises, and global brands to deliver innovative digital solutions.
                        Our commitment to quality, creativity, and results has earned us the trust of businesses across diverse industries worldwide.
                        From web development and e-commerce to digital marketing and design, we continue to empower 200+ companies in building their
                        digital success stories.
                    </Lead>
                </Container>
                <Marquee items={data?.leftMarquee} direction="left" />
                <Marquee items={data?.rightMarquee} direction="right" />
            </Section>

            {/* We offer */}
            <section className="relative isolate overflow-hidden">
                <Decor src={img('icons/left_shape.webp')} className="top-1/4 left-0 h-[450px] w-[180px] object-contain xl:h-[600px] xl:w-[230px]" />
                <Decor src={img('icons/right_shape.webp')} className="top-1/4 right-0 h-[450px] w-[150px] object-cover xl:h-[600px] xl:w-[185px]" />
                <Container>
                    <div className="flex flex-col gap-2.5 text-center">
                        <H2>We Offer</H2>
                        <Lead className="mx-auto 2xl:w-3/5">
                            We build high-performing websites and custom web applications using modern technologies like React, Next.js, and Node.js. Our
                            solutions are fast, secure, and scalable — designed to help your business grow online.
                        </Lead>
                    </div>
                    <div className="mt-12 flex flex-wrap justify-center gap-6">
                        {OFFERS.map((o) => (
                            <div
                                key={o.to}
                                className={cn('w-full md:w-[calc(50%-0.75rem)]', !o.wide && 'lg:w-[calc((100%-3rem)/3)]')}
                            >
                                <Card className={o.wide ? 'min-h-[250px]' : undefined}>
                                    <img src={img(`icons/${o.icon}.webp`)} alt="" className="w-max" />
                                    <CardTitle>{o.title}</CardTitle>
                                    <p className="text-sm/5 text-white">{o.text}</p>
                                    <ButtonLink to={o.to} className="mt-6">
                                        Read More <span className="sr-only">{o.sr}</span>
                                    </ButtonLink>
                                </Card>
                            </div>
                        ))}
                        <div className="w-full">
                            <ButtonLink to="/services" className="mx-auto mt-6">
                                Explore All Services
                            </ButtonLink>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Why choose us */}
            <Section className="relative isolate overflow-hidden">
                <Decor
                    src={img('icons/green_marble.webp')}
                    className="top-[50px] -left-[30px] size-[100px] animate-spin-slower object-contain sm:top-0 sm:-left-[50px] sm:size-[150px] lg:top-[100px] lg:-left-[100px] lg:size-[200px] xl:-left-[150px] xl:size-[300px]"
                />
                <Decor
                    src={img('icons/green_marble.webp')}
                    className="-right-[50px] -bottom-[50px] size-[150px] animate-spin-slow object-cover lg:-bottom-[70px] lg:size-[200px] 2xl:-right-[100px] 2xl:bottom-0"
                />
                <Container className="grid items-center gap-6 md:grid-cols-2">
                    <img className="w-full" src={img('why_choose_us.webp')} alt="" loading="lazy" />
                    <div>
                        <div className="flex flex-col gap-2.5">
                            <H2>Why Choose Us?</H2>
                            <Lead>
                                At CodesExperts, we don’t just build websites — we build digital growth. From Web & App Development to E-commerce, UI/UX,
                                SEO, SMO, Graphics, and Digital Marketing, our solutions are tailored to your business needs. With a focus on innovation,
                                transparency, and measurable results, we help brands attract more leads, engage customers, and achieve long-term success.
                            </Lead>
                        </div>
                        <ButtonLink to="/contact" className="mt-6">
                            Let's Connect
                        </ButtonLink>
                    </div>
                </Container>
            </Section>

            <Testimonials items={data?.testimonials} />
        </>
    );
}
