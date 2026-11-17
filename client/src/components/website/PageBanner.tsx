import { publicAsset } from '../../utils/helpers';
import { Container, Decor } from './ui';

const marble = publicAsset('assets/images/icons/marble.webp');

/** Inner-page hero with the gradient title. */
export default function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <section
            className="relative isolate h-[400px] overflow-hidden bg-cover bg-center bg-no-repeat pt-[120px] pb-[70px] min-[351px]:pt-[185px]"
            style={{ backgroundImage: `url(${publicAsset('assets/images/main_bnr_bg.webp')})` }}
        >
            <Decor src={marble} className="top-[30%] left-[10%] size-[70px] animate-spin-slow opacity-40" />
            <Decor src={marble} className="right-0 -bottom-[30%] size-[200px] animate-spin-slower opacity-60 sm:-bottom-[40%] sm:size-[300px]" />
            <Container>
                <div className="flex flex-col gap-2.5 text-center">
                    <h1 className="text-gradient text-[35px]/[45px] font-medium capitalize sm:text-[40px]/[50px] 2xl:text-[65px]/[80px]">{title}</h1>
                    {subtitle && <p className="text-sm/6 text-white capitalize xl:text-base/6">{subtitle}</p>}
                </div>
            </Container>
        </section>
    );
}
