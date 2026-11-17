import { Container, Section, SectionIntro } from './ui';

const STATS = [
    ['3+', 'Years of Excellence'],
    ['100+', 'Clients Served'],
    ['50+', 'Projects Completed'],
    ['20+', 'Workforce Strength'],
] as const;

export default function Counter() {
    return (
        <Section>
            <Container>
                <SectionIntro title="What We’ve Accomplished" />
                <div className="mt-7 grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {STATS.map(([value, label]) => (
                        <div key={label} className="flex min-h-[150px] flex-col rounded-md border border-white p-5 text-center">
                            <p className="text-[50px]/[60px] font-semibold text-white">{value}</p>
                            <h3 className="mt-2.5 text-[22px]/8 font-medium text-white">{label}</h3>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
