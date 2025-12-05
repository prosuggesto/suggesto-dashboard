import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                    <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full overflow-auto">
                        <h2 className="text-xl font-semibold mb-2 text-red-400">Error:</h2>
                        <pre className="text-sm font-mono whitespace-pre-wrap mb-4">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <h2 className="text-xl font-semibold mb-2 text-gray-400">Component Stack:</h2>
                        <pre className="text-sm font-mono whitespace-pre-wrap text-gray-500">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
