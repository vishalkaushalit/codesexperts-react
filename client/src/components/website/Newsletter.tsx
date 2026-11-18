import { useState, type FormEvent } from 'react';
import { api, firstErrors } from '../../services/api';
import { publicAsset } from '../../utils/helpers';
import { Button, Container, H2, Lead } from './ui';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>(null);
    const [sending, setSending] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus(null);
        try {
            const res = await api.post<{ message: string }>('/subscribe', { email });
            setStatus({ type: 'success', message: res.message });
            setEmail('');
        } catch (err) {
            setStatus({ type: 'error', message: firstErrors(err).email ?? (err as Error).message });
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="bg-surface py-[70px]">
            <Container className="grid gap-6 lg:grid-cols-2">
                <div>
                    <div className="flex flex-col gap-2.5">
                        <H2>Let’s discuss the idea</H2>
                        <Lead>
                            Every great project begins with a conversation. At CodesExperts, we’re here to listen, understand your vision, and turn it
                            into reality. Whether it’s web development, digital marketing, UI/UX, or branding, our team is ready to craft solutions that
                            match your goals. Let’s connect and build something extraordinary together!
                        </Lead>
                    </div>
                    <form className="mt-[30px]" onSubmit={submit}>
                        <div className="flex items-center gap-2">
                            <label htmlFor="newsletter_email" className="sr-only">
                                Email
                            </label>
                            <input
                                type="email"
                                id="newsletter_email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-3/5 rounded-lg bg-white p-2.5 text-black placeholder:text-slate-500"
                            />
                            <Button type="submit" disabled={sending}>
                                {sending ? 'Sending…' : 'Subscribe'}
                            </Button>
                        </div>
                        {status && (
                            <p role="status" className={status.type === 'success' ? 'mt-2 text-green-400' : 'mt-2 text-red-400'}>
                                {status.message}
                            </p>
                        )}
                    </form>
                </div>
                <img src={publicAsset('assets/images/newsletter.webp')} alt="" className="w-full" loading="lazy" />
            </Container>
        </section>
    );
}
