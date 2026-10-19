import { ExternalLink } from 'lucide-react';
import { profile } from '../../../shared/profile.ts';
import { Modal } from '../../components/Modal.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';
import { cx } from '../../lib/cx.ts';
import type { ProfileSection } from '../chat/types.ts';
import { AboutView } from './AboutView.tsx';
import { ProjectsView } from './ProjectsView.tsx';
import { SkillsView } from './SkillsView.tsx';

const TITLES: Record<ProfileSection, string> = {
  me: 'Hello There, Welcome to My Portfolio',
  projects: 'Projects',
  skills: 'Skills',
};

const FULL_PAGE: Partial<Record<ProfileSection, { path: string; label: string; tone: string }>> = {
  projects: { path: '/projects', label: 'See All Projects', tone: 'bg-blue-600 hover:bg-blue-700' },
  skills: { path: '/skills', label: 'See All Skills', tone: 'bg-purple-600 hover:bg-purple-700' },
};

interface ProfileDialogProps {
  section: ProfileSection;
  interests: string[];
  onClose: () => void;
  onContact: () => void;
}

export function ProfileDialog({ section, interests, onClose, onContact }: ProfileDialogProps) {
  const fullPage = FULL_PAGE[section];
  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={TITLES[section]}
      size="xl"
      actions={
        fullPage && (
          <Tooltip content="Open in a new tab">
            <a
              href={fullPage.path}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-bold text-white transition-all duration-200 active:scale-95 max-sm:hidden',
                fullPage.tone,
              )}
            >
              <ExternalLink size={16} aria-hidden />
              {fullPage.label}
            </a>
          </Tooltip>
        )
      }
    >
      <div className="bg-white p-6 dark:bg-gray-900">
        {section === 'me' && (
          <AboutView profile={profile} interests={interests} onContact={onContact} />
        )}
        {section === 'projects' && <ProjectsView profile={profile} />}
        {section === 'skills' && <SkillsView profile={profile} />}
      </div>
    </Modal>
  );
}
