import { Sparkles } from 'lucide-react';
import { Modal } from '../../components/Modal.tsx';
import { cx } from '../../lib/cx.ts';
import { QUESTIONS_BY_TOPIC } from './answers.ts';

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAsk: (question: string) => void;
}

/** Every prepared question, grouped by topic. */
export function QuestionsDialog({ open, onOpenChange, onAsk }: QuestionsDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Quick Questions" placement="corner">
      <div className="p-2">
        {[...QUESTIONS_BY_TOPIC].map(([topic, answers]) => (
          <section key={topic} className="mb-4">
            <h3 className="mb-2 px-2 py-1 text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-500">
              {topic}
            </h3>
            {answers.map(({ id, question, suggested }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onAsk(question);
                  onOpenChange(false);
                }}
                className={cx(
                  'mb-1 flex w-full items-center gap-2 rounded-lg p-3 text-left text-sm transition-all hover:translate-x-1',
                  suggested
                    ? 'border border-blue-400 bg-blue-100 font-medium text-blue-600 hover:bg-blue-200 dark:border-blue-700/50 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50',
                )}
              >
                {suggested && <Sparkles className="h-4 w-4 shrink-0 text-blue-400" aria-hidden />}
                {question}
              </button>
            ))}
          </section>
        ))}
      </div>
    </Modal>
  );
}
