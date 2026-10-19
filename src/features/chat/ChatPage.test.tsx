import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { preferReducedMotion, renderPage } from '../../test/render.tsx';
import { FALLBACK, followUpsFor, SUGGESTED } from './answers.ts';
import ChatPage from './ChatPage.tsx';

beforeEach(preferReducedMotion);

const first = SUGGESTED[0]!;

describe('ChatPage', () => {
  it('answers a suggested question and offers its follow-ups', async () => {
    const user = userEvent.setup();
    renderPage(<ChatPage />);

    await user.click(screen.getByRole('button', { name: first.question }));

    expect(await screen.findByRole('button', { name: 'Back to topics' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: followUpsFor(first)[0]! })).toBeInTheDocument();
  });

  it('matches a typed question to the closest prepared answer', async () => {
    const user = userEvent.setup();
    renderPage(<ChatPage />);

    await user.type(screen.getByLabelText('Chat message'), 'How do I reach him?{Enter}');

    expect(
      await screen.findByRole('link', { name: 'linkedin.com/in/zachariahayers' }),
    ).toBeInTheDocument();
  });

  it('falls back to the suggested questions when nothing matches', async () => {
    const user = userEvent.setup();
    renderPage(<ChatPage />);

    await user.type(screen.getByLabelText('Chat message'), 'qwerty asdf{Enter}');

    expect(await screen.findByText(FALLBACK)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: first.question })).toBeInTheDocument();
  });

  it('says where its answers come from', () => {
    renderPage(<ChatPage />);
    expect(screen.getByText(/Answers from Zach's résumé and project notes/)).toBeInTheDocument();
  });
});
