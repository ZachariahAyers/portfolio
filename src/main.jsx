import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { TooltipProvider } from './components/Tooltip.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </ErrorBoundary>
  </StrictMode>,
)
