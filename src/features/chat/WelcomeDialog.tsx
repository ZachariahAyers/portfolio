import { Info, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/Modal.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';

/** "Meet ARLO": what the guide is and where its answers come from. */
export function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip content="About ARLO">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="About ARLO"
          className="cursor-pointer rounded-2xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Info className="h-6 w-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" />
        </button>
      </Tooltip>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title={
          <span className="flex items-center gap-2">
            <MessageCircle className="text-blue-400" aria-hidden /> Meet ARLO
          </span>
        }
      >
        <div className="space-y-6 p-8 max-sm:p-4">
          <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-700/50">
            <section className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-400">A guide to Zach&apos;s work</h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                Ask <strong className="text-gray-900 dark:text-white">ARLO</strong> what you would
                ask Zach in a first conversation: his experience, his products, his clients and his
                stack.
              </p>
            </section>
            <section className="space-y-2">
              <h3 className="text-xl font-semibold text-green-400">How ARLO answers</h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                Every answer is written in advance from Zach&apos;s résumé and project notes. ARLO
                matches your question to the closest one; it does not generate text. For anything it
                cannot answer, it gives you Zach&apos;s email.
              </p>
            </section>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 active:scale-95"
            >
              Ask ARLO
            </button>
            <p className="text-center text-sm text-gray-500">Built with React and TypeScript</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
