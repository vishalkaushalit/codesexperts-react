import { Container, Section, SectionIntro } from './ui';

const STATS = [
    ['4+', 'Years of Excellence'],
    ['100+', 'Clients Served'],
    ['50+', 'Projects Completed'],
    ['6+', 'Countries Served'],
] as const;

export default function Counter() {
    return (
        <Section>
            <Container>
                <SectionIntro title="What We’ve Accomplished" />
                <div className="mt-7 flex flex-wrap justify-center gap-6">
                    {STATS.map(([value, label]) => (
                        <div
                            key={label}
                            className="flex min-h-[150px] w-[calc(50%-0.75rem)] flex-col items-center justify-center rounded-md border border-white p-5 text-center lg:w-[calc((100%-4.5rem)/4)]"
                        >
                            <p className="text-[50px]/[60px] font-semibold text-white">{value}</p>
                            <h3 className="mt-2.5 text-[22px]/8 font-medium text-white">{label}</h3>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
