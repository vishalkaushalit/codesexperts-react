import Carousel from '../common/Carousel';
import type { Testimonial } from '../../types/models';
import { publicAsset, stripTags, uploadUrl } from '../../utils/helpers';
import { Container, Lead, H2 } from './ui';

export default function Testimonials({ items = [] }: { items?: Testimonial[] }) {
    return (
        <section
            className="min-h-[600px] bg-cover bg-center bg-no-repeat py-[70px]"
            style={{ backgroundImage: `url(${publicAsset('assets/images/testimonial_bg.webp')})` }}
        >
            <Container>
                <div className="flex flex-col gap-2.5 text-center">
                    <p className="text-white">Testimonials</p>
                    <H2>What Our Clients Say</H2>
                    <Lead>Trusted by Businesses Worldwide – Hear from Our Happy Clients</Lead>
                </div>
                {items.length > 0 && (
                    <Carousel className="my-6">
                        {items.map((t) => (
                            <div key={t.id} className="mt-6 h-[calc(100%-1.5rem)] border border-white p-4">
                                <p className="min-h-[150px] text-sm/6 text-white lg:text-base/[26px]">"{stripTags(t.description)}"</p>
                                <div className="mt-4 flex items-center gap-2.5">
                                    <img src={uploadUrl(t.image)} alt="" className="size-[70px] shrink-0 rounded-full object-cover" loading="lazy" />
                                    <div>
                                        <h3 className="text-lg/8 text-white lg:text-xl/8">{stripTags(t.name)}</h3>
                                        <p className="text-xs text-white lg:text-base">{stripTags(t.profile)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                )}
            </Container>
        </section>
    );
}
