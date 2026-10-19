import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  CircleEllipsis,
  Layers,
  type LucideIcon,
  Mail,
  User,
} from 'lucide-react';
import { Tooltip } from '../../components/Tooltip.tsx';
import type { ChatDialog } from './types.ts';

interface Action {
  label: string;
  view: NonNullable<ChatDialog>;
  icon: LucideIcon;
  color?: string;
  tooltip: string;
}

const ACTIONS: readonly Action[] = [
  { label: 'Me', view: 'me', icon: User, color: '#14B8A6', tooltip: 'About me' },
  {
    label: 'Projects',
    view: 'projects',
    icon: Briefcase,
    color: '#3E9858',
    tooltip: 'View my projects',
  },
  { label: 'Skills', view: 'skills', icon: Layers, color: '#856ED9', tooltip: 'View my skills' },
  {
    label: 'Contact',
    view: 'contact',
    icon: Mail,
    color: '#EAB308',
    tooltip: 'Contact information',
  },
  {
    label: 'Questions',
    view: 'questions',
    icon: CircleEllipsis,
    tooltip: 'More question suggestions',
  },
];

interface QuickActionsProps {
  open: boolean;
  onToggle: () => void;
  onOpen: (view: NonNullable<ChatDialog>) => void;
}

export function QuickActions({ open, onToggle, onOpen }: QuickActionsProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-center">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {open ? <ChevronDown size={14} aria-hidden /> : <ChevronUp size={14} aria-hidden />}
          {open ? 'Hide Quick Tools' : 'Show Quick Tools'}
        </button>
      </div>
      {open && (
        <div className="flex flex-wrap justify-center gap-2">
          {ACTIONS.map(({ label, view, icon: Icon, color, tooltip }) => (
            <Tooltip content={tooltip} key={view}>
              <button
                type="button"
                onClick={() => onOpen(view)}
                aria-label={tooltip}
                className="min-w-[100px] shrink-0 cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 backdrop-blur-xs transition-all duration-200 hover:bg-gray-200 active:scale-95 max-sm:min-w-[80px] max-sm:px-3 max-sm:py-2.5 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700"
              >
                <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Icon size={18} strokeWidth={2} {...(color && { color })} aria-hidden />
                  <span className="text-sm font-medium">{label}</span>
                </span>
              </button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
