import { useEffect, useRef } from 'react';
import { TypingDots } from '../../components/TypingDots.tsx';
import { useIsMobile } from '../../lib/useMediaQuery.ts';
import { AssistantAvatar, MessageBubble } from './MessageBubble.tsx';
import { followUpsFor } from './questions.ts';
import type { Message } from './types.ts';

interface MessageListProps {
  messages: Message[];
  waiting: boolean;
  lastQuestion: string | null;
  showFollowUps: boolean;
  onTypingDone: () => void;
  onAsk: (question: string) => void;
  onBackToTopics: () => void;
}

export function MessageList({
  messages,
  waiting,
  lastQuestion,
  showFollowUps,
  onTypingDone,
  onAsk,
  onBackToTopics,
}: MessageListProps) {
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const followUps = followUpsFor(lastQuestion).slice(0, isMobile ? 2 : undefined);

  // Follow the conversation as it grows, including while an answer is being typed.
  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() =>
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }),
    );
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const chip =
    'shrink-0 whitespace-nowrap rounded-full border border-gray-300 bg-gray-200 px-3 py-1.5 text-xs text-gray-700 transition-all duration-200 hover:bg-gray-300 hover:text-gray-900 active:scale-95 max-sm:px-2 max-sm:py-1 max-sm:text-[10px] dark:border-gray-700/50 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/40 dark:hover:text-gray-300';

  return (
    <div className="flex min-h-0 w-full max-w-3xl flex-col">
      <div
        className="scrollbar-subtle flex-1 overflow-y-auto p-4 max-sm:p-3 md:p-6"
        aria-live="polite"
      >
        <div ref={contentRef}>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              onTypingDone={index === messages.length - 1 ? onTypingDone : noop}
            />
          ))}
          {waiting && (
            <div className="my-4 flex items-start gap-3">
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <AssistantAvatar />
              </div>
              <div className="rounded-lg rounded-bl-none bg-gray-300 p-4 dark:bg-gray-800">
                <TypingDots />
              </div>
            </div>
          )}
          {showFollowUps && !waiting && messages.length > 0 && (
            <div className="my-4 animate-fade-in-up max-sm:my-2">
              <p className="mb-1 px-2 text-[10px] text-gray-500 sm:hidden dark:text-gray-400">
                Suggested:
              </p>
              <div className="scrollbar-hide flex flex-wrap gap-1.5 px-2 max-sm:flex-nowrap max-sm:gap-1 max-sm:overflow-x-auto max-sm:px-1">
                {followUps.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className={chip}
                    onClick={() => onAsk(question)}
                  >
                    {question}
                  </button>
                ))}
                <button type="button" className={chip} onClick={onBackToTopics}>
                  Back to topics
                </button>
              </div>
            </div>
          )}
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}

function noop() {}
