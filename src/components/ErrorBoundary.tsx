import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { ErrorReport } from '../../shared/error-report.ts';
import { beacon } from '../lib/api.ts';

function browserName(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg/')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  return 'Other';
}

interface State {
  hasError: boolean;
}

/** Shows a recovery screen on a render error and reports a summary (no stack) in production. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (!import.meta.env.PROD) {
      console.error(error, info.componentStack);
      return;
    }
    const report: ErrorReport = {
      type: error.name.slice(0, 100),
      message: error.message.slice(0, 1000),
      component: (info.componentStack?.split('\n').find(Boolean)?.trim() ?? 'unknown').slice(
        0,
        300,
      ),
      page: window.location.pathname.slice(0, 300),
      browser: browserName(navigator.userAgent),
    };
    beacon('/api/errors', report);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#1a1a1a] p-8 text-center text-white">
        <h1 className="mb-4 text-[2rem]">Something went wrong</h1>
        <p className="mb-8 opacity-80">I&apos;ve been notified and will look into this issue.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-sm bg-[#007bff] px-8 py-3 text-base text-white"
        >
          Reload Page
        </button>
      </div>
    );
  }
}
