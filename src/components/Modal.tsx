import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';
import { cx } from '../lib/cx.ts';

type Placement = 'center' | 'sheet-right' | 'corner';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Hide the title visually; it is still announced to screen readers. */
  hideTitle?: boolean;
  description?: string;
  actions?: ReactNode;
  placement?: Placement;
  size?: 'md' | 'lg' | 'xl';
  children: ReactNode;
}

const placementClass: Record<Placement, string> = {
  center:
    'left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl animate-scale-in',
  'sheet-right': 'right-0 top-0 h-full w-80 max-w-full animate-slide-in-right',
  corner:
    'bottom-20 right-4 max-h-[60vh] w-80 max-w-[calc(100%-2rem)] rounded-xl animate-fade-in-up',
};

const sizeClass = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

/** Accessible dialog: focus trap, Escape to close, scroll lock and labelled content. */
export function Modal({
  open,
  onOpenChange,
  title,
  hideTitle = false,
  description,
  actions,
  placement = 'center',
  size = 'md',
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] animate-fade-in bg-black/60 backdrop-blur-xs dark:bg-black/70" />
        <Dialog.Content
          {...(!description && { 'aria-describedby': undefined })}
          className={cx(
            'fixed z-[9999] flex flex-col overflow-hidden bg-white shadow-2xl dark:bg-gray-900',
            placementClass[placement],
            placement === 'center' && sizeClass[size],
          )}
        >
          <header
            className={cx(
              'flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800',
              hideTitle && 'sr-only',
            )}
          >
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </Dialog.Title>
            <div className="flex items-center gap-3">
              {actions}
              <Dialog.Close
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
          </header>
          {description && (
            <Dialog.Description className="sr-only">{description}</Dialog.Description>
          )}
          <div className="dialog-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
