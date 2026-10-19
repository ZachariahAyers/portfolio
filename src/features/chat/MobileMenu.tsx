import { Briefcase, Globe, Layers, type LucideIcon, Mail, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { profile } from '../../content/profile.ts';
import { Modal } from '../../components/Modal.tsx';
import { AssistantAvatar } from './MessageBubble.tsx';
import type { ChatDialog, ProfileSection } from './types.ts';

const NAV: readonly { icon: LucideIcon; label: string; view: ProfileSection | 'contact' }[] = [
  { icon: User, label: 'About Me', view: 'me' },
  { icon: Briefcase, label: 'Projects/Case Studies', view: 'projects' },
  { icon: Layers, label: 'Skills', view: 'skills' },
  { icon: Mail, label: 'Contact', view: 'contact' },
];

const LINKS = [
  { label: 'ayers.repair', href: profile.contact.site },
  { label: 'LinkedIn', href: profile.contact.linkedin },
  { label: 'GitHub', href: profile.contact.github },
];

interface MobileMenuProps {
  onOpen: (view: NonNullable<ChatDialog>) => void;
  onContact: () => void;
}

export function MobileMenu({ onOpen, onContact }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-200 md:hidden dark:hover:bg-gray-700"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        placement="sheet-right"
        title={
          <span className="flex items-center gap-3">
            <span className="block h-10 w-10 overflow-hidden rounded-full">
              <AssistantAvatar />
            </span>
            <span className="text-lg">{profile.personal.name}</span>
          </span>
        }
      >
        <nav className="flex h-full flex-col" aria-label="Main">
          <ul className="flex-1 space-y-1 py-4">
            {NAV.map(({ icon: Icon, label, view }) => (
              <li key={view}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (view === 'contact') onContact();
                    else onOpen(view);
                  }}
                  className="group flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Icon
                    className="h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
                    aria-hidden
                  />
                  <span className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400">
              Links
            </h3>
            <ul className="space-y-2">
              {LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-1 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Globe className="h-4 w-4" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </Modal>
    </>
  );
}
