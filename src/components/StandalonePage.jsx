import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { Tooltip } from './Tooltip';

const StandalonePage = ({ title, children }) => (
  <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip content="Return to the main portfolio page">
              <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Navigate back to portfolio">
                <ArrowLeft size={20} />
                <span>Back to Portfolio</span>
              </Link>
            </Tooltip>
            <span className="text-gray-400 dark:text-gray-600">|</span>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>
          <Tooltip content="Go to homepage">
            <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Navigate to homepage">
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Tooltip>
        </div>
      </div>
    </header>
    <main className="container mx-auto px-4 py-8">{children}</main>
  </div>
);

export default StandalonePage;
