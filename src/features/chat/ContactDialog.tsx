import { Send } from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { z } from 'zod';
import { type ContactRequest, ContactRequestSchema } from '../../../shared/contact.ts';
import { profile } from '../../../shared/profile.ts';
import { Modal } from '../../components/Modal.tsx';
import { postJson } from '../../lib/api.ts';

type Status = 'idle' | 'sending' | 'sent' | 'failed';
type FieldErrors = Partial<Record<keyof ContactRequest, string>>;

const EMPTY: ContactRequest = { name: '', email: '', message: '', website: '' };

const input =
  'w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
const label = 'mb-2 block text-sm font-bold text-gray-800 dark:text-gray-300';
const button =
  'flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-bold text-white transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-500';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const [form, setForm] = useState<ContactRequest>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const update = (field: keyof ContactRequest) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = ContactRequestSchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'name' || field === 'email' || field === 'message' || field === 'website') {
          next[field] ??= issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      await postJson('/api/contact', parsed.data, z.object({ ok: z.literal(true) }));
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  const changeOpen = (next: boolean) => {
    if (!next && status === 'sent') {
      setForm(EMPTY);
      setStatus('idle');
    }
    onOpenChange(next);
  };

  return (
    <Modal open={open} onOpenChange={changeOpen} title="Contact Zachariah Ayers" size="md">
      <div className="p-8 max-sm:p-4">
        {status === 'sent' && (
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Thank You!</h3>
            <p className="mb-6 text-gray-800 dark:text-gray-300">
              Your message has been sent. I&apos;ll get back to you shortly.
            </p>
            <button type="button" className={`${button} mx-auto`} onClick={() => changeOpen(false)}>
              Back to Chat
            </button>
          </div>
        )}
        {status === 'failed' && (
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Message not sent
            </h3>
            <p className="mb-6 text-gray-800 dark:text-gray-300">
              Something went wrong. Please try again, or email me directly at{' '}
              <a className="text-blue-500 underline" href={`mailto:${profile.contact.email}`}>
                {profile.contact.email}
              </a>
              .
            </p>
            <button type="button" className={`${button} mx-auto`} onClick={() => setStatus('idle')}>
              Try Again
            </button>
          </div>
        )}
        {(status === 'idle' || status === 'sending') && (
          <form onSubmit={(event) => void submit(event)} noValidate>
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={form.website ?? ''}
              onChange={(event) => update('website')(event.target.value)}
            />
            <Field id="contact-name" label="Your Name" error={errors.name}>
              <input
                id="contact-name"
                className={input}
                value={form.name}
                maxLength={100}
                autoComplete="name"
                disabled={status === 'sending'}
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => update('name')(event.target.value)}
              />
            </Field>
            <Field id="contact-email" label="Your Email" error={errors.email}>
              <input
                id="contact-email"
                type="email"
                className={input}
                value={form.email}
                maxLength={254}
                autoComplete="email"
                disabled={status === 'sending'}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => update('email')(event.target.value)}
              />
            </Field>
            <Field id="contact-message" label="Message" error={errors.message}>
              <textarea
                id="contact-message"
                rows={5}
                className={input}
                value={form.message}
                maxLength={5000}
                disabled={status === 'sending'}
                aria-invalid={Boolean(errors.message)}
                onChange={(event) => update('message')(event.target.value)}
              />
            </Field>
            <div className="flex justify-end">
              <button type="submit" className={button} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}{' '}
                <Send size={16} aria-hidden />
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

function Field({
  id,
  label: text,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
