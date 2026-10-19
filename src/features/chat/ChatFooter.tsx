import { profile } from '../../content/profile.ts';

/** Where ARLO's answers come from, outbound links and copyright. */
export function ChatFooter() {
  const link = 'transition-colors hover:text-gray-700 dark:hover:text-gray-300';
  return (
    <>
      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Answers from Zach&apos;s résumé and project notes. Anything else:{' '}
        <a href={`mailto:${profile.contact.email}`} className="underline">
          {profile.contact.email}
        </a>
      </p>
      <div className="mt-2 border-t border-gray-200 pt-2 text-center text-xs text-gray-500 md:mt-4 md:pt-4 dark:border-white/10 dark:text-gray-400">
        <nav
          className="hidden flex-wrap items-center justify-center gap-x-3 gap-y-1 md:flex"
          aria-label="Links"
        >
          <a href={profile.contact.site} target="_blank" rel="noopener noreferrer" className={link}>
            ayers.repair
          </a>
          <span aria-hidden>•</span>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            GitHub
          </a>
        </nav>
        <p className="md:mt-2">© Ayers Electronics Inc</p>
      </div>
    </>
  );
}
