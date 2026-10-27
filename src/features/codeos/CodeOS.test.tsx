import { screen } from '@testing-library/react';
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

const renderEmbedded = () =>
  renderPage(<CodeOS title="Portfolio" source={[]} standalone embedded />);

describe('CodeOS embedded in a frame', () => {
  it('opens Portfolio and tells the parent it is ready', () => {
    const post = spyOnParent();
    renderEmbedded();
    expect(screen.getByRole('region', { name: 'Portfolio' })).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith({ type: 'ayers-codeos-ready' }, window.location.origin);
  });

  it('asks the parent to close on Escape', async () => {
    const post = spyOnParent();
    const user = userEvent.setup();
    renderEmbedded();
    await user.keyboard('{Escape}');
    expect(post).toHaveBeenCalledWith({ type: 'ayers-codeos-close' }, window.location.origin);
  });

  it('leaves Escape alone when a menu or dialog already used it', async () => {
    const user = userEvent.setup();
    const post = spyOnParent();
    renderEmbedded();
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
  it('opens Portfolio full screen when embedded', () => {
    spyOnParent();
    const original = window.matchMedia;
    window.matchMedia = (query: string) => ({ ...original(query), matches: true });
    try {
      renderEmbedded();
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
    renderEmbedded();
    const window98 = screen.getByRole('region', { name: 'Portfolio' });

    await user.click(screen.getByRole('button', { name: 'Portfolio', pressed: true }));
    expect(window98).toHaveAttribute('hidden');

    await user.click(screen.getByRole('button', { name: 'Portfolio', pressed: false }));
    expect(window98).not.toHaveAttribute('hidden');
  });
});
