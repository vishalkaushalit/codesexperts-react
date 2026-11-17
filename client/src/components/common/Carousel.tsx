import { Children, useEffect, useState, type ReactNode } from 'react';
import useItemsPerView from '../../hooks/useItemsPerView';
import { cn } from '../../utils/helpers';

const RESPONSIVE = { 0: 1, 768: 2, 1199: 3 };
const GAP = 30; // px between slides
const SPEED = 1000; // ms slide animation
const AUTOPLAY = 3000; // ms between slides

/** Looping, autoplaying carousel (replaces the old jQuery Owl Carousel). Pauses on hover. */
export default function Carousel({ children, className }: { children: ReactNode; className?: string }) {
    const items = Children.toArray(children);
    const count = items.length;
    const perView = useItemsPerView(RESPONSIVE);
    const slides = count > perView;

    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [paused, setPaused] = useState(false);

    useEffect(() => setIndex(0), [count, perView]);

    useEffect(() => {
        if (!slides || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const t = setInterval(() => {
            setAnimate(true);
            setIndex((i) => i + 1);
        }, AUTOPLAY);
        return () => clearInterval(t);
    }, [slides, paused]);

    // After sliding onto the cloned items, jump back to the real first item without animating.
    const onTransitionEnd = () => {
        if (index >= count) {
            setAnimate(false);
            setIndex(0);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
        }
    };

    const width = `((100% - ${(perView - 1) * GAP}px) / ${perView})`;
    const rendered = slides ? [...items, ...items.slice(0, perView)] : items;

    return (
        <div className={cn('relative w-full', className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="overflow-hidden">
                <div
                    className={cn('flex w-full will-change-transform', !slides && 'justify-center')}
                    style={{
                        gap: GAP,
                        transform: `translateX(calc(-${index} * (${width} + ${GAP}px)))`,
                        transition: animate ? `transform ${SPEED}ms ease` : 'none',
                    }}
                    onTransitionEnd={onTransitionEnd}
                >
                    {rendered.map((child, i) => (
                        <div key={i} className="min-w-0" style={{ flex: `0 0 calc(${width})` }} aria-hidden={i >= count || undefined}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            {slides && (
                <div className="mt-2.5 flex flex-wrap justify-center">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            className="group p-0"
                            aria-label={`Go to slide ${i + 1}`}
                            aria-current={index % count === i || undefined}
                            onClick={() => {
                                setAnimate(true);
                                setIndex(i);
                            }}
                        >
                            <span
                                className={cn(
                                    'mx-[7px] my-[5px] block size-2.5 rounded-full transition-colors group-hover:bg-brand',
                                    index % count === i ? 'bg-brand' : 'bg-[#d6d6d6]',
                                )}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
