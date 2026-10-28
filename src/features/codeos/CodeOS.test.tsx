import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderPage } from '../../test/render.tsx';
import { CodeOS } from './CodeOS.tsx';

// In jsdom the parent window is the window itself, so the spy sees what the frame would send.
const spyOnParent = () =>
  vi.spyOn(window.parent, 'postMessage').mockImplementation(() => undefined);

afterEach(() => {
  vi.restoreAllMocks();
});

const renderEmbedded = async () => {
  renderPage(<CodeOS title="Portfolio" source={[]} standalone embedded />);
  expect(screen.getByRole('progressbar', { name: 'Loading CodeOS' })).toBeInTheDocument();
  await act(async () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        source: window.parent,
        data: { type: 'ayers-codeos-open' },
      }),
    );
  });
  await waitFor(
    () => expect(screen.getByRole('button', { name: 'Ayers Software Repair' })).toBeInTheDocument(),
    { timeout: 4000 },
  );
};

describe('CodeOS embedded in a frame', () => {
  it('waits for the same-origin parent before starting the embedded boot', async () => {
    spyOnParent();
    vi.useFakeTimers();
    try {
      renderPage(<CodeOS title="Portfolio" source={[]} standalone embedded />);
      for (const sender of [
        { origin: 'https://unrelated.example', source: window.parent },
        { origin: window.location.origin, source: null },
      ]) {
        await act(async () => {
          window.dispatchEvent(
            new MessageEvent('message', {
              ...sender,
              data: { type: 'ayers-codeos-open' },
            }),
          );
          vi.advanceTimersByTime(5000);
        });
      }
      expect(screen.getByRole('progressbar', { name: 'Loading CodeOS' })).toHaveAttribute(
        'value',
        '0',
      );
      expect(screen.queryByRole('button', { name: 'Portfolio' })).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
  it('shows the loading screen, then opens the desktop without launching Portfolio', async () => {
    const post = spyOnParent();
    await renderEmbedded();
    expect(screen.queryByRole('region', { name: 'Portfolio' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Arcade' })).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith({ type: 'ayers-codeos-ready' }, window.location.origin);
  });

  it('asks the parent to close on Escape', async () => {
    const post = spyOnParent();
    const user = userEvent.setup();
    await renderEmbedded();
    await user.keyboard('{Escape}');
    expect(post).toHaveBeenCalledWith({ type: 'ayers-codeos-close' }, window.location.origin);
  });

  it('leaves Escape alone when a menu or dialog already used it', async () => {
    const user = userEvent.setup();
    const post = spyOnParent();
    await renderEmbedded();
    // What a Radix layer does when Escape closes it: handle it first, in the capture phase.
    document.addEventListener('keydown', (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
    await user.keyboard('{Escape}');
    expect(post).not.toHaveBeenCalledWith({ type: 'ayers-codeos-close' }, expect.anything());
  });
});

describe('CodeOS on a phone', () => {
  it('shows all desktop apps on a phone, then opens the selected one', async () => {
    spyOnParent();
    const original = window.matchMedia;
    window.matchMedia = (query: string) =>
      Object.assign(original(query), { matches: query.includes('max-width') });
    try {
      await renderEmbedded();
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Portfolio' }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Arcade' })).toBeInTheDocument();
      await userEvent.setup().click(screen.getByRole('button', { name: 'Portfolio' }));
      expect(screen.getByRole('heading', { level: 2, name: 'Portfolio' })).toBeInTheDocument();
      expect(screen.queryByRole('region', { name: 'Portfolio' })).not.toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('CodeOS taskbar', () => {
  it('minimises the front window and restores it, keeping it mounted', async () => {
    spyOnParent();
    const user = userEvent.setup();
    await renderEmbedded();
    await user.click(screen.getByRole('button', { name: 'Portfolio' }));
    const window98 = screen.getByRole('region', { name: 'Portfolio' });

    await user.click(screen.getByRole('button', { name: 'Portfolio', pressed: true }));
    expect(window98).toHaveAttribute('hidden');

    await user.click(screen.getByRole('button', { name: 'Portfolio', pressed: false }));
    expect(window98).not.toHaveAttribute('hidden');
  });
});
