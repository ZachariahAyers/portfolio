import { Tooltip } from '../../components/Tooltip.tsx';
import { useIsMobile } from '../../lib/useMediaQuery.ts';
import { MOBILE_SUGGESTION_COUNT, SUGGESTED } from './answers.ts';

/** The empty-conversation screen: a greeting and starter questions. */
export function SuggestedQuestions({ onAsk }: { onAsk: (question: string) => void }) {
  const isMobile = useIsMobile();
  const questions = (isMobile ? SUGGESTED.slice(0, MOBILE_SUGGESTION_COUNT) : SUGGESTED).map(
    (answer) => answer.question,
  );

  return (
    <div className="flex flex-1 animate-fade-in flex-col justify-center p-8 text-center max-sm:p-4">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 max-sm:text-xl dark:text-white">
        Welcome to my Portfolio! I&apos;m Zach
      </h2>
      <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        Pick a question below, or type your own.
      </p>
      <div className="stagger-in mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <Tooltip content="Click to ask this question" key={question}>
            <button
              type="button"
              onClick={() => onAsk(question)}
              className="animate-fade-in-up rounded-lg border border-gray-300 bg-gray-100 p-3 text-left text-sm opacity-0 transition-all duration-200 hover:bg-gray-200 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {question}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
