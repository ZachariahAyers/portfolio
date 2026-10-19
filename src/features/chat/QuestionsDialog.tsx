import { Briefcase, Code, Settings, Sparkles, Users } from 'lucide-react';
import { profile } from '../../../shared/profile.ts';
import { Modal } from '../../components/Modal.tsx';
import { cx } from '../../lib/cx.ts';
import { FEATURED_QUESTIONS } from './questions.ts';

const CATEGORIES: Record<string, { label: string; icon: typeof Code }> = {
  technical: { label: 'Technical Questions', icon: Code },
  behavioral: { label: 'Behavioral Questions', icon: Users },
  situational: { label: 'Situational Questions', icon: Settings },
  projectSpecific: { label: 'Project-Specific Questions', icon: Briefcase },
  compensationAndLogistics: { label: 'Logistics', icon: Settings },
};

const QUESTIONS_PER_CATEGORY = 3;

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAsk: (question: string) => void;
}

export function QuestionsDialog({ open, onOpenChange, onAsk }: QuestionsDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Quick Questions" placement="corner">
      <div className="p-2">
        {Object.entries(profile.interviewQuestions).map(([category, questions]) => {
          const { label, icon: Icon } = CATEGORIES[category] ?? { label: category, icon: Code };
          return (
            <section key={category} className="mb-4">
              <h3 className="mb-2 flex items-center gap-2 px-2 py-1 text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-500">
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </h3>
              {questions.slice(0, QUESTIONS_PER_CATEGORY).map((question) => {
                const featured = FEATURED_QUESTIONS.has(question);
                return (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      onAsk(question);
                      onOpenChange(false);
                    }}
                    className={cx(
                      'mb-1 flex w-full items-center gap-2 rounded-lg p-3 text-left text-sm transition-all hover:translate-x-1',
                      featured
                        ? 'border border-blue-400 bg-blue-100 font-medium text-blue-600 hover:bg-blue-200 dark:border-blue-700/50 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50',
                    )}
                  >
                    {featured && (
                      <Sparkles className="h-4 w-4 shrink-0 text-blue-400" aria-hidden />
                    )}
                    {question}
                  </button>
                );
              })}
            </section>
          );
        })}
      </div>
    </Modal>
  );
}
