import type { ContactRequest } from '../shared/contact.ts';
import { UpstreamError } from './gemini.ts';

export interface MailConfig {
  apiKey: string;
  from: string;
  to: string;
  fetch: typeof fetch;
}

/** Sends the contact form to the site owner through Resend, as plain text. */
export async function sendContactEmail(config: MailConfig, contact: ContactRequest): Promise<void> {
  const response = await config.fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      'content-type': 'application/json',
    },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: contact.email,
      subject: `Portfolio message from ${contact.name}`,
      text: `${contact.message}\n\n--\n${contact.name} <${contact.email}>`,
    }),
  });
  if (!response.ok) throw new UpstreamError(502, `Resend answered ${response.status}`);
}
