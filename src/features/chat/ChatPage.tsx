import { useCallback, useRef, useState } from 'react';
import type { Answer } from '../../content/schema.ts';
import { MOBILE_QUERY } from '../../lib/useMediaQuery.ts';
import { ProfileDialog } from '../profile/ProfileDialog.tsx';
import { ANSWERS, CONTACT_QUESTION, FALLBACK } from './answers.ts';
import { ChatFooter } from './ChatFooter.tsx';
import { ChatHeader } from './ChatHeader.tsx';
import { Composer } from './Composer.tsx';
import { matchAnswer } from './match.ts';
import { MessageList } from './MessageList.tsx';
import { QuestionsDialog } from './QuestionsDialog.tsx';
import { QuickActions } from './QuickActions.tsx';
import { SuggestedQuestions } from './SuggestedQuestions.tsx';
import type { ChatDialog, Message, ProfileSection } from './types.ts';

const isProfileSection = (view: ChatDialog): view is ProfileSection =>
  view === 'me' || view === 'projects' || view === 'skills';

/** The home page: ARLO answers typed or picked questions from the prepared answer set. */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [lastAnswer, setLastAnswer] = useState<Answer | null>(null);
  const [followUpsReady, setFollowUpsReady] = useState(false);
  const [dialog, setDialog] = useState<ChatDialog>(null);
  const [quickToolsOpen, setQuickToolsOpen] = useState(
    () => !window.matchMedia(MOBILE_QUERY).matches,
  );
  const nextId = useRef(0);

  const append = (role: Message['role'], text: string, animate: boolean) =>
    setMessages((current) => [...current, { id: nextId.current++, role, text, animate }]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    const answer = matchAnswer(text, ANSWERS);
    append('user', text, false);
    append('assistant', answer?.answer ?? FALLBACK, true);
    setDraft('');
    setLastAnswer(answer);
    setFollowUpsReady(false);
  };

  const onTypingDone = useCallback(() => setFollowUpsReady(true), []);
  const backToTopics = () => {
    setMessages([]);
    setLastAnswer(null);
    setFollowUpsReady(false);
  };
  const closeDialog = (next: boolean) => {
    if (!next) setDialog(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 font-sans text-gray-900 dark:bg-gray-900 dark:bg-linear-to-br dark:from-gray-900 dark:to-slate-900 dark:text-gray-200">
      <ChatHeader onOpen={setDialog} onContact={() => ask(CONTACT_QUESTION)} />

      <div className="relative z-0 flex min-h-0 flex-1 flex-col">
        {messages.length === 0 ? (
          <SuggestedQuestions onAsk={ask} />
        ) : (
          <main className="flex min-h-0 flex-1 justify-center">
            <MessageList
              messages={messages}
              lastAnswer={lastAnswer}
              showFollowUps={followUpsReady}
              onTypingDone={onTypingDone}
              onAsk={ask}
              onBackToTopics={backToTopics}
            />
          </main>
        )}

        <footer className="sticky bottom-0 border-t border-gray-300 bg-gray-100/95 p-2 backdrop-blur-sm sm:p-3 md:border-0 md:bg-transparent md:p-4 md:px-6 md:pb-6 dark:border-gray-700 dark:bg-gray-900/95">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 md:mb-3">
              <QuickActions
                open={quickToolsOpen}
                onToggle={() => setQuickToolsOpen((current) => !current)}
                onOpen={setDialog}
                onContact={() => ask(CONTACT_QUESTION)}
              />
            </div>
            <Composer draft={draft} onDraftChange={setDraft} onSubmit={() => ask(draft)} />
            <ChatFooter />
          </div>
        </footer>
      </div>

      <QuestionsDialog open={dialog === 'questions'} onOpenChange={closeDialog} onAsk={ask} />
      {isProfileSection(dialog) && (
        <ProfileDialog key={dialog} section={dialog} onClose={() => setDialog(null)} />
      )}
    </div>
  );
}
