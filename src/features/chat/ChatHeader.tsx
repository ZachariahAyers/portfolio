import { profile } from '../../content/profile.ts';
import { ThemeToggle } from '../../components/ThemeToggle.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';
import { AssistantAvatar } from './MessageBubble.tsx';
import { MobileMenu } from './MobileMenu.tsx';
import type { ChatDialog } from './types.ts';
import { WelcomeDialog } from './WelcomeDialog.tsx';

const navLink =
  'text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 md:text-base dark:text-gray-400 dark:hover:text-white';

interface ChatHeaderProps {
  onOpen: (view: NonNullable<ChatDialog>) => void;
  onContact: () => void;
}

export function ChatHeader({ onOpen, onContact }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-300 bg-gray-100 p-3 backdrop-blur-lg md:p-4 dark:border-white/10 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WelcomeDialog />
          <div className="h-10 w-10 overflow-hidden rounded-full shadow-lg">
            <AssistantAvatar />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {profile.personal.name}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">{profile.personal.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden items-center gap-4 md:flex" aria-label="Main">
            <Tooltip content="About me">
              <button type="button" className={navLink} onClick={() => onOpen('me')}>
                Me
              </button>
            </Tooltip>
            <Tooltip content="View my projects and case studies">
              <button type="button" className={navLink} onClick={() => onOpen('projects')}>
                Projects/Case Studies
              </button>
            </Tooltip>
            <Tooltip content="View my skills">
              <button type="button" className={navLink} onClick={() => onOpen('skills')}>
                Skills
              </button>
            </Tooltip>
            <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" aria-hidden />
            <a
              className={navLink}
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className={navLink}
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
          <ThemeToggle />
          <MobileMenu onOpen={onOpen} onContact={onContact} />
        </div>
      </div>
    </header>
  );
}
