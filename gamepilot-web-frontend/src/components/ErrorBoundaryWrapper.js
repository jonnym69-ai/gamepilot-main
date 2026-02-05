"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withErrorBoundary = exports.useErrorHandler = exports.ComponentErrorBoundaryWrapper = exports.PageErrorBoundaryWrapper = exports.ErrorBoundaryWrapper = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ErrorBoundary_1 = require("./ErrorBoundary");
const ToastProvider_1 = require("./ui/ToastProvider");
const ErrorBoundaryWrapper = ({ children, fallback, onError }) => {
    const { showError } = (0, ToastProvider_1.useToast)();
    const handleError = (error, errorInfo) => {
        // Show toast notification for the error
        showError(`Component error: ${error.message}`);
        // Call custom error handler if provided
        if (onError) {
            onError(error, errorInfo);
        }
    };
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { fallback: fallback, onError: handleError, children: children }));
};
exports.ErrorBoundaryWrapper = ErrorBoundaryWrapper;
// Specialized wrappers for different use cases
const PageErrorBoundaryWrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(exports.ErrorBoundaryWrapper, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-900", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Page Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-6", children: "This page couldn't be loaded properly." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Reload Page" })] }) }), children: children }));
exports.PageErrorBoundaryWrapper = PageErrorBoundaryWrapper;
const ComponentErrorBoundaryWrapper = ({ children, fallback }) => ((0, jsx_runtime_1.jsx)(exports.ErrorBoundaryWrapper, { fallback: fallback || ((0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-red-900 border border-red-700 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-200 text-sm", children: "Component failed to load" }) })), children: children }));
exports.ComponentErrorBoundaryWrapper = ComponentErrorBoundaryWrapper;
// Hook for functional components to handle errors
const useErrorHandler = () => {
    const { showError, showWarning } = (0, ToastProvider_1.useToast)();
    return react_1.default.useCallback((error, context, type = 'error') => {
        console.error(`Error in ${context}:`, error);
        const message = `${context ? `${context}: ` : ''}${error.message}`;
        if (type === 'warning') {
            showWarning(message);
        }
        else {
            showError(message);
        }
    }, [showError, showWarning]);
};
exports.useErrorHandler = useErrorHandler;
// Higher-order component for wrapping components with error boundary
const withErrorBoundary = (Component, fallback) => {
    const WrappedComponent = (props) => ((0, jsx_runtime_1.jsx)(exports.ErrorBoundaryWrapper, { fallback: fallback, children: (0, jsx_runtime_1.jsx)(Component, { ...props }) }));
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
};
exports.withErrorBoundary = withErrorBoundary;
