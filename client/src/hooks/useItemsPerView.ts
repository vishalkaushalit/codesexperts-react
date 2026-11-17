import { useEffect, useState } from 'react';

/** Number of carousel items for the current window width, e.g. { 0: 1, 768: 2, 1199: 3 }. */
export default function useItemsPerView(responsive: Record<number, number>): number {
    const pick = () => {
        let items = 1;
        Object.keys(responsive)
            .map(Number)
            .sort((a, b) => a - b)
            .forEach((bp) => {
                if (window.innerWidth >= bp) items = responsive[bp];
            });
        return items;
    };
    const [items, setItems] = useState(pick);

    useEffect(() => {
        const onResize = () => setItems(pick());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return items;
}
