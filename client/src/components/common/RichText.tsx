import { cn } from '../../utils/helpers';

interface Props {
    html: string | null | undefined;
    className?: string;
    /** "dark" for the black website, "light" for the admin panel. */
    tone?: 'dark' | 'light';
}

/** Renders admin-authored HTML from the CMS (only logged-in admins can edit it), styled with Tailwind Typography. */
export default function RichText({ html, className, tone = 'dark' }: Props) {
    return (
        <div
            className={cn(
                'prose max-w-none',
                tone === 'dark' && 'prose-invert text-white prose-p:text-white prose-li:text-white prose-strong:font-medium prose-a:text-brand',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: html ?? '' }}
        />
    );
}
