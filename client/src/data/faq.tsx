import type { ReactNode } from 'react';
import type { AccordionItem } from '../components/common/Accordion';

const link = 'text-brand hover:underline';

const ContactLinks = ({ children }: { children: ReactNode }) => (
    <>
        <a className={link} href="https://codesexperts.com">codesexperts.com</a> or email us at{' '}
        <a className={link} href="mailto:support@codesexperts.com">support@codesexperts.com</a>
        {children}
    </>
);

/** About page FAQ (was components/faq.blade.php). */
export const generalFaq: AccordionItem[] = [
    {
        q: 'What services does CodesExperts provide?',
        a: 'We offer a complete range of digital solutions including web development, digital marketing, SEO, e-commerce solutions, UI/UX design, and IT consultancy to help businesses grow online.',
    },
    {
        q: 'How can your services help my business grow?',
        a: 'Our strategies are designed to increase your online visibility, generate qualified leads, improve customer engagement, and ultimately drive revenue growth.',
    },
    {
        q: 'Do you work with startups as well as established businesses?',
        a: 'Yes, we work with businesses of all sizes — from startups to large enterprises — tailoring our solutions to meet their unique goals and challenges.',
    },
    {
        q: 'How long does it take to see results from SEO or digital marketing?',
        a: 'SEO and digital marketing are long-term strategies. While some improvements can be seen within a few weeks, significant results typically take 3–6 months depending on your industry and competition.',
    },
    {
        q: 'Can you create a custom website for my business?',
        a: 'Absolutely! We specialize in building responsive, user-friendly, and SEO-optimized websites tailored to your brand and business objectives.',
    },
    {
        q: 'Do you provide ongoing support after project completion?',
        a: 'Yes, we believe in long-term partnerships. Our team offers continuous support, maintenance, and updates to ensure your digital presence remains strong for the first month after launch and beyond it will cost you extra charges.',
    },
    {
        q: 'What industries do you serve?',
        a: 'We have experience working across multiple industries including e-commerce, healthcare, education, finance, real estate, hospitality, and more.',
    },
    {
        q: 'How do you ensure transparency in your process?',
        a: 'We follow a transparent approach by sharing regular progress reports, analytics, and measurable results so you always know the impact of our work.',
    },
    {
        q: 'Can you help with social media marketing and management?',
        a: 'Yes, our digital marketing experts create and manage social media strategies that boost engagement, brand awareness, and customer loyalty.',
    },
    {
        q: 'How do I get started with CodesExperts?',
        a: (
            <>
                Getting started is simple! Just contact us through our website{' '}
                <ContactLinks>
                    , share your requirements, and our team will schedule a consultation to create a customized strategy
                    for your business.
                </ContactLinks>
            </>
        ),
    },
];

/** Services pages FAQ (was components/servicesFaq.blade.php). */
export const servicesFaq: AccordionItem[] = [
    {
        q: 'What technologies do you use for web development?',
        a: 'We specialize in multiple programming languages like HTML, CSS, PHP, Laravel, React, Node Js etc. along with secure back-end solutions and responsive front-end designs to ensure performance and scalability.',
    },
    {
        q: 'Can you redesign or upgrade my existing website?',
        a: 'Yes, we can revamp your current website with updated design, improved functionality, and optimized performance to meet modern standards.',
    },
    {
        q: 'How long does it take to build a website?',
        a: 'The timeline depends on the project’s complexity—simple websites can take 1–2 weeks, while custom web applications or e-commerce platforms may take 3–4 weeks.',
    },
    {
        q: 'What is the difference between SEO and SMO?',
        a: 'SEO (Search Engine Optimization) improves your website’s ranking on Google and other search engines, while SMO (Social Media Optimization) increases brand visibility and engagement on social media platforms.',
    },
    {
        q: 'How soon can I expect results from SEO?',
        a: 'SEO is a long-term strategy. Usually, noticeable improvements appear within 3–6 months, depending on competition and niche.',
    },
    {
        q: 'Do you only design websites, or do you also focus on user experience?',
        a: 'We go beyond visuals—our UI/UX design ensures your website or app is not just attractive but also intuitive, easy to navigate, and user-friendly.',
    },
    {
        q: 'Which platforms do you use for e-commerce development?',
        a: 'We work with Shopify, WooCommerce, and custom solutions, tailoring features like secure payment gateways, product management, and mobile optimization.',
    },
    {
        q: 'Can you integrate third-party tools into my e-commerce site?',
        a: 'Yes, we integrate payment gateways, CRMs, inventory systems, shipping APIs, and other third-party tools to streamline your business operations.',
    },
    {
        q: 'What kind of videos do you create?',
        a: 'We create promotional videos, corporate presentations, explainer animations, social media reels, and motion graphics tailored to your brand’s story.',
    },
    {
        q: 'How do I get started with CodesExperts?',
        a: (
            <>
                Simply reach out with your requirements through our website{' '}
                <ContactLinks>
                    , share your requirements, and we’ll provide a free consultation, project plan, and quotation to get
                    started.
                </ContactLinks>
            </>
        ),
    },
];
