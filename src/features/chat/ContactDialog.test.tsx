import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderPage } from '../../test/render.tsx';
import { ContactDialog } from './ContactDialog.tsx';

afterEach(() => vi.unstubAllGlobals());

async function fill(name: string, email: string, message: string) {
  const user = userEvent.setup();
  if (name) await user.type(screen.getByLabelText('Your Name'), name);
  if (email) await user.type(screen.getByLabelText('Your Email'), email);
  if (message) await user.type(screen.getByLabelText('Message'), message);
  await user.click(screen.getByRole('button', { name: /send message/i }));
}

describe('ContactDialog', () => {
  it('shows what is wrong next to the field instead of sending', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>();
    vi.stubGlobal('fetch', fetch);
    renderPage(<ContactDialog open onOpenChange={() => undefined} />);
    await fill('Ada', 'not-an-email', 'Hello');
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends the message and thanks the visitor', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(() =>
      Promise.resolve(Response.json({ ok: true })),
    );
    vi.stubGlobal('fetch', fetch);
    renderPage(<ContactDialog open onOpenChange={() => undefined} />);
    await fill('Ada', 'ada@example.com', 'Hello there');
    expect(await screen.findByText('Thank You!')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }));
  });

  it('offers a retry when sending fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof globalThis.fetch>(() =>
        Promise.resolve(Response.json({ error: 'busy' }, { status: 502 })),
      ),
    );
    renderPage(<ContactDialog open onOpenChange={() => undefined} />);
    await fill('Ada', 'ada@example.com', 'Hello there');
    expect(await screen.findByText('Message not sent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });
});
