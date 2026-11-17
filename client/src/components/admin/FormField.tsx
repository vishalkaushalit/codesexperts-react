import { useEffect, useState } from 'react';
import { ImageUp } from 'lucide-react';
import type { Field } from '../../config/adminResources';
import { cn, uploadUrl } from '../../utils/helpers';
import RichTextEditor from './RichTextEditor';
import { inputClass } from './ui';

interface Props {
    field: Field;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
    options?: Array<[string, string]>;
    isEdit?: boolean;
}

/** One form control driven by a field definition from config/adminResources.ts. */
export default function FormField({ field, value, onChange, error, options = [], isEdit }: Props) {
    const { name, label, type = 'text', required, placeholder, hint, max, rows } = field;
    const id = `field_${name}`;
    const hintId = `${id}_hint`;
    const errorId = `${id}_error`;
    const describedBy = cn(hint && hintId, error && errorId) || undefined;
    const text = typeof value === 'string' ? value : value == null ? '' : String(value);

    if (type === 'checkbox') {
        return (
            <label htmlFor={id} className="flex items-center gap-2.5 text-sm text-slate-700">
                <input type="checkbox" id={id} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="size-4 rounded border-slate-300 accent-brand" />
                {label}
            </label>
        );
    }

    let control;
    if (type === 'image') {
        control = <ImageInput id={id} field={field} current={text} onChange={onChange} invalid={Boolean(error)} describedBy={describedBy} isEdit={isEdit} />;
    } else if (type === 'richtext') {
        control = <RichTextEditor id={id} value={text} onChange={onChange} invalid={Boolean(error)} describedBy={describedBy} />;
    } else if (type === 'textarea') {
        control = (
            <textarea
                id={id}
                rows={rows ?? 4}
                value={text}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={inputClass(Boolean(error))}
            />
        );
    } else if (type === 'select') {
        control = (
            <select id={id} value={text} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={inputClass(Boolean(error))}>
                <option value="">Select {label.toLowerCase()}…</option>
                {options.map(([v, l]) => (
                    <option key={v} value={v}>
                        {l}
                    </option>
                ))}
            </select>
        );
    } else {
        const listId = field.suggestions ? `${id}_list` : undefined;
        control = (
            <>
                <input
                    type={type === 'url' ? 'url' : 'text'}
                    id={id}
                    value={text}
                    placeholder={placeholder}
                    list={listId}
                    onChange={(e) => onChange(e.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={inputClass(Boolean(error))}
                />
                {listId && (
                    <datalist id={listId}>
                        {field.suggestions?.map((s) => <option key={s} value={s} />)}
                    </datalist>
                )}
            </>
        );
    }

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
                {required && !(type === 'image' && isEdit) && <span className="text-red-500"> *</span>}
            </label>
            {control}
            <div className="mt-1.5 flex justify-between gap-3">
                <div>
                    {error && (
                        <p id={errorId} className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    {hint && (
                        <p id={hintId} className="text-xs text-slate-500">
                            {hint}
                            {type === 'image' && isEdit && ' Leave empty to keep the current image.'}
                        </p>
                    )}
                </div>
                {max && (
                    <p className={cn('shrink-0 text-xs tabular-nums', text.length > max ? 'font-semibold text-red-600' : 'text-slate-400')}>
                        {text.length}/{max}
                    </p>
                )}
            </div>
        </div>
    );
}

function ImageInput({
    id,
    field,
    current,
    onChange,
    invalid,
    describedBy,
    isEdit,
}: {
    id: string;
    field: Field;
    current: string;
    onChange: (file: File | null) => void;
    invalid: boolean;
    describedBy?: string;
    isEdit?: boolean;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

    const shown = preview ?? (current ? uploadUrl(current) : null);

    return (
        <div className={cn('flex items-center gap-4 rounded-lg border border-dashed bg-white p-3', invalid ? 'border-red-400' : 'border-slate-300')}>
            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100">
                {shown ? <img src={shown} alt="" className="size-full object-contain" /> : <ImageUp aria-hidden className="size-6 text-slate-400" />}
            </div>
            <div className="min-w-0">
                <label htmlFor={id} className="cursor-pointer text-sm font-medium text-slate-900 underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-dark">
                    {shown ? (isEdit && !preview ? 'Replace image' : 'Choose another') : 'Choose image'}
                </label>
                <input
                    id={id}
                    type="file"
                    className="sr-only"
                    accept={field.accept ?? 'image/jpeg,image/png,image/webp'}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setPreview(file ? URL.createObjectURL(file) : null);
                        setFileName(file?.name ?? '');
                        onChange(file);
                    }}
                />
                {fileName && <p className="mt-1 truncate text-xs text-slate-500">{fileName}</p>}
            </div>
        </div>
    );
}
