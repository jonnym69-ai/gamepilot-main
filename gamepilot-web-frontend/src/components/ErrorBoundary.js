"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentErrorBoundary = exports.PageErrorBoundary = exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
class ErrorBoundary extends react_1.Component {
    constructor(props) {
        super(props);
        this.logErrorToService = (error, errorInfo) => {
            const errorData = {
                errorId: this.state.errorId,
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorBoundary: true,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: this.getUserId(),
                sessionId: this.getSessionId()
            };
            console.log('Error details:', errorData);
            // Future: Send to error tracking service
            // Sentry.captureException(error, { extra: errorData })
        };
        this.getUserId = () => {
            try {
                const user = localStorage.getItem('user');
                return user ? JSON.parse(user).id : 'anonymous';
            }
            catch {
                return 'anonymous';
            }
        };
        this.getSessionId = () => {
            let sessionId = sessionStorage.getItem('error_session_id');
            if (!sessionId) {
                sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                sessionStorage.setItem('error_session_id', sessionId);
            }
            return sessionId;
        };
        this.handleRetry = () => {
            this.setState({ hasError: false, error: undefined, errorId: undefined });
            // Note: Removed toast.info call to avoid React hook issues
        };
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return { hasError: true, error, errorId };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        // Log error to external service in production
        if (process.env.NODE_ENV === 'production') {
            // Production error logging - integrate with error tracking service
            // Future: Implement Sentry, LogRocket, or similar error tracking
            this.logErrorToService(error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDE35" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white mb-4", children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: this.state.error?.message || 'An unexpected error occurred while loading this page.' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: this.handleRetry, className: "w-full px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors", children: "\uD83D\uDD04 Try Again" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "w-full px-6 py-3 bg-gaming-secondary text-white rounded-lg hover:bg-gaming-secondary/80 transition-colors", children: "\uD83D\uDD04 Reload Page" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "block w-full px-6 py-3 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80 transition-colors text-center", children: "\uD83C\uDFE0 Go Home" })] }), process.env.NODE_ENV === 'development' && this.state.error?.stack && ((0, jsx_runtime_1.jsxs)("details", { className: "mt-6 text-left", children: [(0, jsx_runtime_1.jsx)("summary", { className: "text-red-400 cursor-pointer hover:text-red-300 transition-colors", children: "Error Details (Development)" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 p-4 bg-black/50 rounded-lg text-xs text-red-300 overflow-auto max-h-40", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Error ID:" }), " ", this.state.errorId] }), (0, jsx_runtime_1.jsx)("pre", { className: "whitespace-pre-wrap", children: this.state.error.stack })] })] }))] }) }) }));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
// Page-specific error boundaries
const PageErrorBoundary = ({ children }) => ((0, jsx_runtime_1.jsx)(ErrorBoundary, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDCC4" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white mb-4", children: "Page Load Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: "This page couldn't be loaded properly. Please try refreshing or go back to the home page." }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "w-full px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors", children: "\uD83D\uDD04 Refresh Page" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "block w-full px-6 py-3 bg-gaming-secondary text-white rounded-lg hover:bg-gaming-secondary/80 transition-colors text-center", children: "\uD83C\uDFE0 Go Home" })] })] }) }) }), children: children }));
exports.PageErrorBoundary = PageErrorBoundary;
// Component-specific error boundaries
const ComponentErrorBoundary = ({ children, componentName = 'Component' }) => ((0, jsx_runtime_1.jsx)(ErrorBoundary, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-6 border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-3", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-2", children: [componentName, " Error"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm mb-4", children: "This component encountered an error and couldn't be displayed." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors text-sm", children: "\uD83D\uDD04 Reload" })] }) }), children: children }));
exports.ComponentErrorBoundary = ComponentErrorBoundary;
