import RichText from '../../components/common/RichText';
import PageBanner from '../../components/website/PageBanner';
import { Container, Section } from '../../components/website/ui';
import useApi from '../../hooks/useApi';
import type { PolicyData } from '../../types/models';

export default function PrivacyPolicy() {
    const { data } = useApi<PolicyData>('/privacy-policy');

    return (
        <>
            <PageBanner title="Privacy Policy" />
            <Section>
                <Container>
                    <RichText html={data?.policy?.description} className="prose-h2:text-[26px]/9 prose-h2:font-medium prose-h3:text-[22px]/[30px] prose-h3:font-medium" />
                </Container>
            </Section>
        </>
    );
}
