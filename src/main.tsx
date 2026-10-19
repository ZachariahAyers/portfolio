import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './app/router.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { TooltipProvider } from './components/Tooltip.tsx';
import { applyTheme, initialTheme } from './lib/theme.ts';
import './styles/index.css';

applyTheme(initialTheme());

const root = document.getElementById('root');
if (!root) throw new Error('index.html is missing #root');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <AppRouter />
        </TooltipProvider>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
);
