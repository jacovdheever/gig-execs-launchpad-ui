import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class CommunityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Community ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <CommunityErrorFallback />;
    }

    return this.props.children;
  }
}

const CommunityErrorFallback: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg border border-red-200 p-6 text-center">
      <div className="mb-4">
        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Community Error
      </h3>
      
      <p className="text-gray-600 mb-4">
        There was a problem loading the community content. Please try refreshing the page.
      </p>

      <button
        onClick={handleRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default CommunityErrorBoundary;
