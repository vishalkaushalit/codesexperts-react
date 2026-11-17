import { useMemo, useState } from 'react';
import PageBanner from '../../components/website/PageBanner';
import { Container, Section, SectionIntro } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { ProjectsData } from '../../types/models';
import { cn, uploadUrl } from '../../utils/helpers';

type Filter = 'all' | number;

export default function Projects() {
    const { data, loading } = useApi<ProjectsData>('/projects');
    const [active, setActive] = useState<Filter>('all');

    const projects = useMemo(() => data?.projects ?? [], [data]);
    const categories = useMemo(() => {
        const map = new Map<number, string>();
        projects.forEach((p) => p.category_id != null && !map.has(p.category_id) && map.set(p.category_id, p.category_name ?? ''));
        return [...map];
    }, [projects]);

    const visible = active === 'all' ? projects : projects.filter((p) => p.category_id === active);
    const tabs: Array<[Filter, string]> = [['all', 'All Projects'], ...categories];

    return (
        <>
            <PageBanner title="Project" subtitle="Our Work Speaks for Itself" />

            <Section>
                <Container>
                    <SectionIntro title="What We’ve Built" text="Explore the impactful work we’ve done across industries." />

                    <div className="mt-12 mb-4 flex flex-wrap justify-center gap-1" role="tablist" aria-label="Project categories">
                        {tabs.map(([id, name]) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={active === id}
                                onClick={() => setActive(id)}
                                className={cn(
                                    'rounded-md px-4 py-2 text-white transition-colors',
                                    active === id ? 'bg-brand' : 'hover:text-brand',
                                )}
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-6" role="tabpanel">
                        {visible.map((p) => (
                            <div key={p.id} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]">
                                <div className="mb-4 text-center">
                                    <h3 className="text-xl font-medium text-white">{p.heading}</h3>
                                    {active === 'all' && <p className="text-sm text-white">({p.category_name})</p>}
                                </div>
                                <div className="group mx-auto mb-5 size-[300px] overflow-hidden">
                                    <img
                                        src={uploadUrl(p.image)}
                                        alt={`${p.heading} website screenshot`}
                                        loading="lazy"
                                        className="size-full object-cover object-top transition-all duration-[3000ms] ease-in-out group-hover:object-bottom"
                                    />
                                </div>
                            </div>
                        ))}
                        {!loading && projects.length === 0 && <p className="text-center text-white">Projects will be added soon.</p>}
                    </div>
                </Container>
            </Section>
        </>
    );
}
