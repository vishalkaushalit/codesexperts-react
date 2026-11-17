import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface AccordionItem {
    q: string;
    a: ReactNode;
}

/** One panel open at a time; the first is open by default. */
export default function Accordion({ items }: { items: AccordionItem[] }) {
    const [open, setOpen] = useState(0);
    const uid = useId();

    return (
        <div className="mt-12 flex flex-col gap-4">
            {items.map((item, i) => {
                const isOpen = open === i;
                const panelId = `${uid}-panel-${i}`;
                return (
                    <div key={item.q} className="rounded-md border border-white">
                        <h3>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg/7 font-semibold text-white sm:text-xl/[30px]"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpen(isOpen ? -1 : i)}
                            >
                                <span>
                                    {i + 1}. {item.q}
                                </span>
                                <ChevronDown aria-hidden className={cn('size-5 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
                            </button>
                        </h3>
                        <div id={panelId} hidden={!isOpen} className="px-5 pb-4 text-white">
                            {item.a}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
