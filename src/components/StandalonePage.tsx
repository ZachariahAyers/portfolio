import { ArrowLeft, Home } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Tooltip } from './Tooltip.tsx';

/** Full-page frame for content that also appears in a dialog on the home page. */
export function StandalonePage({ title, children }: { title: string; children: ReactNode }) {
  const linkClass =
    'flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white';
  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-40 border-b border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Tooltip content="Return to the main portfolio page">
              <Link to="/" className={linkClass}>
                <ArrowLeft size={20} aria-hidden />
                <span>Back to Portfolio</span>
              </Link>
            </Tooltip>
            <span className="text-gray-400 dark:text-gray-600" aria-hidden>
              |
            </span>
            <h1 className="text-lg font-bold text-gray-900 md:text-xl dark:text-white">{title}</h1>
          </div>
          <Tooltip content="Go to homepage">
            <Link to="/" className={linkClass} aria-label="Home">
              <Home size={20} aria-hidden />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Tooltip>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
