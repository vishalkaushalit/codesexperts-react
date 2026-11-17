import PageBanner from '../../components/website/PageBanner';
import { Container, Section } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { BlogData } from '../../types/models';
import { uploadUrl } from '../../utils/helpers';

export default function Blog() {
    const { data } = useApi<BlogData>('/blog');
    const posts = data?.blog ?? [];

    return (
        <>
            <PageBanner title="Blog" subtitle="Insights on Web Development, Design, and Digital Growth" />
            <Section>
                <Container className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((b) => (
                        <article key={b.id}>
                            <img src={uploadUrl(b.image)} alt="" className="w-full" loading="lazy" />
                            <h3 className="mt-3 text-xl text-white">{b.title}</h3>
                            <p className="mt-2 text-white">{b.description}</p>
                        </article>
                    ))}
                </Container>
            </Section>
        </>
    );
}
