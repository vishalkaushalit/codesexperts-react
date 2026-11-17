import nodemailer from 'nodemailer';
import { env } from '../config/env.ts';

const transport = env.mail.host
    ? nodemailer.createTransport({
          host: env.mail.host,
          port: env.mail.port,
          secure: env.mail.secure,
          auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
      })
    : null;

/**
 * Notify the site admin. Without SMTP settings the email is logged instead (like Laravel's "log" mailer).
 * Never throws: the submission is already saved, so a mail failure must not fail the request.
 */
export async function notifyAdmin(subject: string, html: string): Promise<void> {
    if (!transport) {
        console.info(`[mail:log] To: ${env.mail.adminEmail}\nSubject: ${subject}\n${html}\n`);
        return;
    }
    try {
        await transport.sendMail({ from: env.mail.from, to: env.mail.adminEmail, subject, html });
    } catch (err) {
        console.warn('Admin notification mail failed:', (err as Error).message);
    }
}
