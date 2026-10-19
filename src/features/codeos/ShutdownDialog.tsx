import { Power } from 'lucide-react';
import { Dialog } from 'radix-ui';

interface ShutdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** "Shut Down CodeOS": confirms leaving the case study for the main site. */
export function ShutdownDialog({ open, onOpenChange, onConfirm }: ShutdownDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/50" />
        <Dialog.Content className="win98-face win98-raised fixed top-1/2 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 font-win98">
          <div className="win98-titlebar flex h-7 items-center justify-between px-1">
            <Dialog.Title className="text-sm font-bold text-white">Shut Down CodeOS</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="win98-face win98-button flex h-5 w-5 items-center justify-center text-xs font-bold text-black"
            >
              ×
            </Dialog.Close>
          </div>
          <div className="p-4 text-black dark:text-white">
            <div className="mb-4 flex items-start gap-3">
              <Power className="mt-1 h-8 w-8 shrink-0 text-yellow-600" aria-hidden />
              <div>
                <p className="text-sm">Return to main site?</p>
                <Dialog.Description className="mt-1 text-xs opacity-75">
                  This will close the CodeOS 98 environment.
                </Dialog.Description>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="win98-face win98-button px-4 py-1 text-sm"
              >
                OK
              </button>
              <Dialog.Close className="win98-face win98-button px-4 py-1 text-sm">
                Cancel
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
