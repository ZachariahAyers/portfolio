import { profile } from '../../../shared/profile.ts';
import { DAILY_LIMIT } from './usage.ts';

const LOW_MESSAGE_WARNING = 40;

/** Disclaimer, outbound links, message allowance and copyright. */
export function ChatFooter({ messagesToday }: { messagesToday: number }) {
  const link = 'transition-colors hover:text-gray-700 dark:hover:text-gray-300';
  return (
    <>
      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        ARLO can make mistakes. Please verify all information with me via the Contact Form
      </p>
      <div className="mt-2 border-t border-gray-200 pt-2 text-center text-xs text-gray-500 md:mt-4 md:pt-4 dark:border-white/10 dark:text-gray-400">
        <div className="flex items-center justify-between px-2 md:hidden">
          <span>© Ayers Electronics Inc</span>
          <span className="text-gray-600 dark:text-gray-500">
            {messagesToday}/{DAILY_LIMIT} Messages Today
          </span>
        </div>
        <div className="hidden space-y-2 md:block">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
            aria-label="Links"
          >
            <a
              href={profile.contact.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              ayers.repair
            </a>
            <span aria-hidden>•</span>
            <a
              href={profile.contact.assemblejs}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              AssembleJS
            </a>
          </nav>
          <p className="text-gray-600 dark:text-gray-500">
            Messages Today: {messagesToday}/{DAILY_LIMIT}
            {messagesToday > LOW_MESSAGE_WARNING && (
              <span className="text-yellow-600 dark:text-yellow-500"> - Running low!</span>
            )}
          </p>
          <p>© Ayers Electronics Inc</p>
        </div>
      </div>
    </>
  );
}
