import type { ComponentProps, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../utils/helpers';

/* Shared website building blocks, matching the original site's typography and buttons. */

export const buttonClass =
    'flex w-max items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm/5 font-medium uppercase text-black transition-colors hover:bg-brand-dark disabled:opacity-60';

export function ButtonLink({ className, ...props }: LinkProps) {
    return <Link className={cn(buttonClass, className)} {...props} />;
}

export function Button({ className, ...props }: ComponentProps<'button'>) {
    return <button className={cn(buttonClass, className)} {...props} />;
}

/** Section wrapper with the site's 70px vertical rhythm. */
export function Section({ className, children, ...props }: ComponentProps<'section'>) {
    return (
        <section className={cn('py-[70px]', className)} {...props}>
            {children}
        </section>
    );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cn('site-container', className)}>{children}</div>;
}

export function H2({ className, children }: { className?: string; children: ReactNode }) {
    return (
        <h2 className={cn('text-[26px]/[36px] font-medium text-white capitalize min-[351px]:text-[30px]/[40px] xl:text-[35px]/[45px] 2xl:text-[40px]/[56px]', className)}>
            {children}
        </h2>
    );
}

export function Lead({ className, children }: { className?: string; children: ReactNode }) {
    return <p className={cn('text-sm/6 text-white capitalize xl:text-base/6', className)}>{children}</p>;
}

/** Heading + optional intro text, centred by default. */
export function SectionIntro({ title, text, className, center = true }: { title: ReactNode; text?: ReactNode; className?: string; center?: boolean }) {
    return (
        <div className={cn('flex flex-col gap-2.5', center && 'text-center', className)}>
            <H2>{title}</H2>
            {text && <Lead>{text}</Lead>}
        </div>
    );
}

/** Bordered black card used throughout the site. */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cn('flex h-full min-h-[300px] flex-col gap-2.5 rounded-md border border-white bg-black p-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
    return <h3 className={cn('text-2xl/8 font-normal text-white capitalize', className)}>{children}</h3>;
}

/** Decorative, slowly spinning background image (the "marble" spheres). */
export function Decor({ src, className }: { src: string; className: string }) {
    return <img src={src} alt="" aria-hidden draggable={false} className={cn('pointer-events-none absolute -z-10 select-none', className)} />;
}
