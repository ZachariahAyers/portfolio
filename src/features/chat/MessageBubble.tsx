import { User } from 'lucide-react';
import Markdown, { type Components } from 'react-markdown';
import { asset } from '../../lib/asset.ts';
import { cx } from '../../lib/cx.ts';
import { conversationalPacing } from '../../lib/pacing.ts';
import { useTypewriter } from '../../lib/useTypewriter.ts';
import type { Message } from './types.ts';

const markdown: Components = {
  p: (props) => <p className="mb-2 last:mb-0" {...props} />,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: (props) => <strong className="font-bold text-inherit" {...props} />,
  ul: (props) => (
    <ul
      className="mb-2 list-inside list-disc space-y-2 pl-4 marker:text-gray-600 dark:marker:text-gray-400"
      {...props}
    />
  ),
  ol: (props) => <ol className="mb-2 list-inside list-decimal space-y-2 pl-4" {...props} />,
  li: (props) => <li className="mb-1 [&>p]:inline" {...props} />,
  pre: (props) => (
    <pre className="mb-3 overflow-x-auto rounded-md bg-gray-100 p-3 dark:bg-gray-900" {...props} />
  ),
  code: (props) => <code className="rounded-sm px-1 py-0.5 text-xs" {...props} />,
  h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-lg font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-base font-bold">{children}</h3>,
};

export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <img
      src={asset('ai-profile.png')}
      alt="ARLO"
      className={cx('h-full w-full object-cover', className)}
      width={40}
      height={40}
    />
  );
}

function Typed({ text, onDone }: { text: string; onDone: () => void }) {
  const { visible } = useTypewriter(text, conversationalPacing, onDone);
  return <Markdown components={markdown}>{visible}</Markdown>;
}

interface MessageBubbleProps {
  message: Message;
  onTypingDone: () => void;
}

export function MessageBubble({ message, onTypingDone }: MessageBubbleProps) {
  const fromAssistant = message.role === 'assistant';
  return (
    <div
      className={cx(
        'my-4 flex animate-fade-in-up items-start gap-3',
        !fromAssistant && 'flex-row-reverse',
      )}
    >
      <div
        className={cx(
          'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full',
          fromAssistant ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-600',
        )}
      >
        {fromAssistant ? <AssistantAvatar /> : <User className="h-5 w-5 text-white" aria-hidden />}
      </div>
      <div
        className={cx(
          'max-w-lg rounded-lg p-4',
          fromAssistant
            ? 'rounded-bl-none bg-gray-300 dark:bg-gray-800'
            : 'rounded-br-none bg-blue-600 text-white dark:bg-blue-800',
        )}
      >
        <div className="text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {message.animate ? (
            <Typed text={message.text} onDone={onTypingDone} />
          ) : (
            <Markdown components={markdown}>{message.text}</Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
