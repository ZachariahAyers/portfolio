import { ArrowUp, Monitor } from 'lucide-react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { Tooltip } from '../../components/Tooltip.tsx';

interface ComposerProps {
  draft: string;
  onDraftChange: (draft: string) => void;
  onSubmit: () => void;
}

export function Composer({ draft, onDraftChange, onSubmit }: ComposerProps) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Browse this site's code in CodeOS 98">
        <Link
          to="/casestudies/portfolio?tab=code"
          className="hidden items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-200 px-3 py-2 text-xs font-bold whitespace-nowrap text-gray-800 transition-colors hover:bg-gray-300 sm:flex dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Monitor size={14} aria-hidden />
          <span className="hidden md:inline">CodeOS 98</span>
        </Link>
      </Tooltip>
      <form
        onSubmit={submit}
        className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white p-2 shadow-lg focus-within:ring-2 focus-within:ring-blue-500 dark:border-white/10 dark:bg-gray-800"
      >
        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a question about Zach's experience, skills, or projects..."
          aria-label="Chat message"
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 text-base text-gray-900 placeholder-gray-500 focus:outline-hidden max-sm:text-sm dark:text-white dark:placeholder-gray-400"
        />
        <Tooltip content="Send message">
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim()}
            className="rounded-md bg-blue-600 p-2 text-white transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            <ArrowUp size={20} aria-hidden />
          </button>
        </Tooltip>
      </form>
    </div>
  );
}
