import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackRender: (params: {
    error: Error;
    resetErrorBoundary?: () => void;
  }) => ReactNode;
  resetErrorBoundary?: () => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.resetErrorBoundary?.();
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallbackRender({
        error: this.state.error,
        resetErrorBoundary: this.reset,
      });
    }

    return this.props.children;
  }
}
