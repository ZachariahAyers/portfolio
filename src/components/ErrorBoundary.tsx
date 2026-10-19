import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

/** Shows a recovery screen on a render error. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (!import.meta.env.PROD) console.error(error, info.componentStack);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#1a1a1a] p-8 text-center text-white">
        <h1 className="mb-4 text-[2rem]">Something went wrong</h1>
        <p className="mb-8 opacity-80">Reloading the page usually fixes it.</p>
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
