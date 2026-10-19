import { useCallback, useRef, useState } from 'react';
import {
  type ChatMessage,
  CHAT_LIMITS,
  CONTACT_FORM_MARKER,
  screenQuestion,
} from '../../../shared/chat.ts';
import { MOBILE_QUERY } from '../../lib/useMediaQuery.ts';
import { ProfileDialog } from '../profile/ProfileDialog.tsx';
import { askAssistant } from './chatClient.ts';
import { ChatFooter } from './ChatFooter.tsx';
import { ChatHeader } from './ChatHeader.tsx';
import { Composer } from './Composer.tsx';
import { ContactDialog } from './ContactDialog.tsx';
import { MessageList } from './MessageList.tsx';
import { QuestionsDialog } from './QuestionsDialog.tsx';
import { QuickActions } from './QuickActions.tsx';
import { SuggestedQuestions } from './SuggestedQuestions.tsx';
import type { ChatDialog, Message, ProfileSection } from './types.ts';
import { checkSend, DAILY_LIMIT, loadUsage, recordSend, saveUsage } from './usage.ts';

const isProfileSection = (view: ChatDialog): view is ProfileSection =>
  view === 'me' || view === 'projects' || view === 'skills';

/** History for the model: the most recent turns, starting with a visitor message. */
function historyFor(messages: Message[]): ChatMessage[] {
  const recent = messages.slice(-CHAT_LIMITS.maxHistory);
  const firstUser = recent.findIndex((m) => m.role === 'user');
  return recent.slice(Math.max(firstUser, 0)).map(({ role, text }) => ({ role, text }));
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [messagesToday, setMessagesToday] = useState(() => loadUsage().count);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [followUpsReady, setFollowUpsReady] = useState(false);
  const [dialog, setDialog] = useState<ChatDialog>(null);
  const [quickToolsOpen, setQuickToolsOpen] = useState(
    () => !window.matchMedia(MOBILE_QUERY).matches,
  );
  const [interests, setInterests] = useState<string[]>([]);
  const nextId = useRef(0);

  const remember = (interest: string) =>
    setInterests((current) =>
      [...current, interest.slice(0, CHAT_LIMITS.maxInterestLength)].slice(
        -CHAT_LIMITS.maxInterests,
      ),
    );

  const append = (role: Message['role'], text: string, animate: boolean) => {
    const message: Message = { id: nextId.current++, role, text, animate };
    setMessages((current) => [...current, message]);
    return message;
  };

  const open = (view: NonNullable<ChatDialog>) => {
    if (isProfileSection(view)) remember(`viewed ${view}`);
    setDialog(view);
  };

  const send = async (question: string) => {
    const text = question.trim();
    if (!text || waiting) return;
    remember(text);

    const screen = screenQuestion(text);
    if (!screen.ok) {
      append('assistant', screen.reply, false);
      return;
    }
    const now = new Date();
    const usage = loadUsage(now);
    const check = checkSend(usage, now);
    if (!check.ok) {
      append(
        'assistant',
        check.reason === 'daily-limit'
          ? `I've reached my daily conversation limit of ${DAILY_LIMIT} messages! I'll be back tomorrow. In the meantime, you can contact Zach directly using the contact form.`
          : `Please wait ${check.waitSeconds} more second${check.waitSeconds > 1 ? 's' : ''} before sending another message.`,
        false,
      );
      return;
    }
    const updated = recordSend(usage, now);
    saveUsage(updated);
    setMessagesToday(updated.count);

    const userMessage = append('user', text, false);
    setDraft('');
    setWaiting(true);
    setLastQuestion(text);
    setFollowUpsReady(false);

    const answer = await askAssistant(historyFor([...messages, userMessage]));
    setWaiting(false);
    if (answer.includes(CONTACT_FORM_MARKER)) {
      append(
        'assistant',
        "Of course! I'll open the contact form so you can send a message to Zach directly.",
        false,
      );
      setFollowUpsReady(true);
      setDialog('contact');
    } else {
      append('assistant', answer, true);
    }
  };

  const ask = (question: string) => void send(question);
  const onTypingDone = useCallback(() => setFollowUpsReady(true), []);
  const backToTopics = () => {
    setMessages([]);
    setLastQuestion(null);
    setFollowUpsReady(false);
  };
  const closeDialog = (next: boolean) => {
    if (!next) setDialog(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 font-sans text-gray-900 dark:bg-gray-900 dark:bg-linear-to-br dark:from-gray-900 dark:to-slate-900 dark:text-gray-200">
      <ChatHeader onOpen={open} />

      <div className="relative z-0 flex min-h-0 flex-1 flex-col">
        {messages.length === 0 ? (
          <SuggestedQuestions onAsk={ask} />
        ) : (
          <main className="flex min-h-0 flex-1 justify-center">
            <MessageList
              messages={messages}
              waiting={waiting}
              lastQuestion={lastQuestion}
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
                onOpen={open}
              />
            </div>
            <Composer
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={() => ask(draft)}
              busy={waiting}
            />
            <ChatFooter messagesToday={messagesToday} />
          </div>
        </footer>
      </div>

      <ContactDialog open={dialog === 'contact'} onOpenChange={closeDialog} />
      <QuestionsDialog open={dialog === 'questions'} onOpenChange={closeDialog} onAsk={ask} />
      {isProfileSection(dialog) && (
        <ProfileDialog
          key={dialog}
          section={dialog}
          interests={interests}
          onClose={() => setDialog(null)}
          onContact={() => setDialog('contact')}
        />
      )}
    </div>
  );
}
