import { useEffect, type ReactNode } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Underline, Undo2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface Props {
    id: string;
    value: string;
    onChange: (html: string) => void;
    invalid?: boolean;
    describedBy?: string;
}

function ToolButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onMouseDown={(e) => e.preventDefault()} // keep the editor selection
            onClick={onClick}
            className={cn('rounded-md p-1.5 transition-colors', active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200')}
        >
            {children}
        </button>
    );
}

function Toolbar({ editor }: { editor: Editor }) {
    const s = useEditorState({
        editor,
        selector: ({ editor: e }) => ({
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            h2: e.isActive('heading', { level: 2 }),
            h3: e.isActive('heading', { level: 3 }),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
            quote: e.isActive('blockquote'),
            link: e.isActive('link'),
        }),
    });
    const chain = () => editor.chain().focus();

    const setLink = () => {
        const previous = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Link URL (leave empty to remove)', previous ?? 'https://');
        if (url === null) return;
        if (url.trim() === '') chain().extendMarkRange('link').unsetLink().run();
        else chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
    };

    const icon = 'size-4';
    return (
        <div className="flex flex-wrap gap-0.5 border-b border-slate-200 bg-slate-50 p-1.5" role="toolbar" aria-label="Formatting">
            <ToolButton label="Heading" active={s.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 className={icon} /></ToolButton>
            <ToolButton label="Subheading" active={s.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 className={icon} /></ToolButton>
            <span className="mx-1 w-px bg-slate-200" />
            <ToolButton label="Bold" active={s.bold} onClick={() => chain().toggleBold().run()}><Bold className={icon} /></ToolButton>
            <ToolButton label="Italic" active={s.italic} onClick={() => chain().toggleItalic().run()}><Italic className={icon} /></ToolButton>
            <ToolButton label="Underline" active={s.underline} onClick={() => chain().toggleUnderline().run()}><Underline className={icon} /></ToolButton>
            <ToolButton label="Link" active={s.link} onClick={setLink}><Link2 className={icon} /></ToolButton>
            <span className="mx-1 w-px bg-slate-200" />
            <ToolButton label="Bulleted list" active={s.bullet} onClick={() => chain().toggleBulletList().run()}><List className={icon} /></ToolButton>
            <ToolButton label="Numbered list" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}><ListOrdered className={icon} /></ToolButton>
            <ToolButton label="Quote" active={s.quote} onClick={() => chain().toggleBlockquote().run()}><Quote className={icon} /></ToolButton>
            <span className="mx-1 w-px bg-slate-200" />
            <ToolButton label="Undo" onClick={() => chain().undo().run()}><Undo2 className={icon} /></ToolButton>
            <ToolButton label="Redo" onClick={() => chain().redo().run()}><Redo2 className={icon} /></ToolButton>
        </div>
    );
}

/** Rich text (HTML) editor, replacing CKEditor. */
export default function RichTextEditor({ id, value, onChange, invalid, describedBy }: Props) {
    const editor = useEditor({
        extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true } })],
        content: value,
        editorProps: {
            attributes: {
                id,
                class: 'prose prose-slate max-w-none px-4 py-3 text-sm',
                'aria-multiline': 'true',
                role: 'textbox',
                ...(describedBy ? { 'aria-describedby': describedBy } : {}),
                ...(invalid ? { 'aria-invalid': 'true' } : {}),
            },
        },
        onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
    });

    // Load content that arrives after the editor was created (e.g. when editing an existing row).
    useEffect(() => {
        if (editor && !editor.isFocused && value !== editor.getHTML() && !(value === '' && editor.isEmpty)) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [editor, value]);

    return (
        <div className={cn('overflow-hidden rounded-lg border bg-white focus-within:outline-2 focus-within:outline-brand', invalid ? 'border-red-400' : 'border-slate-300')}>
            {editor && <Toolbar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
}
