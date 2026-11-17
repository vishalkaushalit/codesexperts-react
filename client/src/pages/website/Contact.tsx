import { useState, type ChangeEvent, type FormEvent } from 'react';
import PageBanner from '../../components/website/PageBanner';
import { Button, Container, Section, SectionIntro } from '../../components/website/ui';
import { api, firstErrors } from '../../services/api';
import { cn, publicAsset } from '../../utils/helpers';

const EMPTY = { contact_name: '', contact_email: '', contact_phone: '', contact_subject: '', contact_message: '' };
type Form = typeof EMPTY;
type Field = keyof Form;

const FIELDS: Array<{ name: Field; label: string; type: string; autoComplete: string }> = [
    { name: 'contact_name', label: 'Name', type: 'text', autoComplete: 'name' },
    { name: 'contact_email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'contact_phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
    { name: 'contact_subject', label: 'Subject', type: 'text', autoComplete: 'off' },
];

const fieldBase = 'w-full bg-white p-2.5 text-black outline-offset-2';
const inputClass = `${fieldBase} rounded-full`;
const textareaClass = `${fieldBase} min-h-[150px] rounded-[20px]`;

export default function Contact() {
    const [form, setForm] = useState<Form>(EMPTY);
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
    const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
    const [sending, setSending] = useState(false);

    const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSending(true);
        setErrors({});
        setStatus(null);
        try {
            const res = await api.post<{ message: string }>('/contact', form);
            setStatus({ ok: true, message: res.message });
            setForm(EMPTY);
        } catch (err) {
            const fieldErrors = firstErrors(err);
            setErrors(fieldErrors);
            if (!Object.keys(fieldErrors).length) setStatus({ ok: false, message: (err as Error).message });
        } finally {
            setSending(false);
        }
    };

    const error = (name: Field) =>
        errors[name] && (
            <p id={`${name}-error`} className="mt-1 text-sm text-red-400">
                {errors[name]}
            </p>
        );

    return (
        <>
            <PageBanner title="Contact" subtitle="Let’s connect and get started" />

            <Section>
                <Container>
                    <SectionIntro title="Get in Touch" text="Contact us to publish your content and show ads to our website and get a good reach." />
                    <div className="my-6 grid items-center gap-6 md:grid-cols-2">
                        <div data-aos="fade-right" data-aos-duration="1000">
                            <img src={publicAsset('assets/images/contact_img1.webp')} alt="" className="w-full animate-float motion-reduce:animate-none" />
                        </div>

                        <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-2">
                            {FIELDS.map((f) => (
                                <div key={f.name}>
                                    <label htmlFor={f.name} className="mb-2 block text-white">
                                        {f.label}
                                    </label>
                                    <input
                                        id={f.name}
                                        name={f.name}
                                        type={f.type}
                                        autoComplete={f.autoComplete}
                                        value={form[f.name]}
                                        onChange={update}
                                        aria-invalid={Boolean(errors[f.name])}
                                        aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                                        className={cn(inputClass, errors[f.name] && 'ring-2 ring-red-500')}
                                    />
                                    {error(f.name)}
                                </div>
                            ))}
                            <div className="lg:col-span-2">
                                <label htmlFor="contact_message" className="mb-2 block text-white">
                                    Message
                                </label>
                                <textarea
                                    id="contact_message"
                                    name="contact_message"
                                    value={form.contact_message}
                                    onChange={update}
                                    aria-invalid={Boolean(errors.contact_message)}
                                    aria-describedby={errors.contact_message ? 'contact_message-error' : undefined}
                                    className={cn(textareaClass, errors.contact_message && 'ring-2 ring-red-500')}
                                />
                                {error('contact_message')}
                            </div>
                            <div className="flex justify-center lg:col-span-2">
                                <Button type="submit" disabled={sending} className="mt-4">
                                    {sending ? 'Sending…' : 'Submit'}
                                </Button>
                            </div>
                            {status && (
                                <p
                                    role="status"
                                    className={cn('rounded-md px-4 py-3 lg:col-span-2', status.ok ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900')}
                                >
                                    {status.message}
                                </p>
                            )}
                        </form>
                    </div>
                </Container>
            </Section>
        </>
    );
}
