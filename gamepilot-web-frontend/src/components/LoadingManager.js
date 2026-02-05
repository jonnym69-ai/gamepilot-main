"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalLoadingOverlay = exports.LoadingIndicator = exports.LoadingProvider = exports.useLoading = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const LoadingContext = (0, react_1.createContext)(undefined);
const useLoading = () => {
    const context = (0, react_1.useContext)(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
exports.useLoading = useLoading;
const LoadingProvider = ({ children }) => {
    const [loadingStates, setLoadingStates] = (0, react_1.useState)({});
    const setLoading = (0, react_1.useCallback)((key, isLoading, message, progress) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                isLoading,
                message,
                progress,
                error: isLoading ? undefined : prev[key]?.error
            }
        }));
    }, []);
    const setError = (0, react_1.useCallback)((key, error) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                isLoading: false,
                error
            }
        }));
    }, []);
    const clearLoading = (0, react_1.useCallback)((key) => {
        setLoadingStates(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
        });
    }, []);
    const clearAllLoading = (0, react_1.useCallback)(() => {
        setLoadingStates({});
    }, []);
    const isLoading = (0, react_1.useCallback)((key) => {
        if (key) {
            return loadingStates[key]?.isLoading || false;
        }
        return Object.values(loadingStates).some(state => state.isLoading);
    }, [loadingStates]);
    const getLoadingMessage = (0, react_1.useCallback)((key) => {
        return loadingStates[key]?.message;
    }, [loadingStates]);
    const getLoadingProgress = (0, react_1.useCallback)((key) => {
        return loadingStates[key]?.progress;
    }, [loadingStates]);
    const getLoadingError = (0, react_1.useCallback)((key) => {
        return loadingStates[key]?.error;
    }, [loadingStates]);
    return ((0, jsx_runtime_1.jsx)(LoadingContext.Provider, { value: {
            loadingStates,
            setLoading,
            setError,
            clearLoading,
            clearAllLoading,
            isLoading,
            getLoadingMessage,
            getLoadingProgress,
            getLoadingError
        }, children: children }));
};
exports.LoadingProvider = LoadingProvider;
// Component for displaying loading states
const LoadingIndicator = ({ key, className = '' }) => {
    const { isLoading, getLoadingMessage, getLoadingProgress, getLoadingError } = (0, exports.useLoading)();
    if (!isLoading(key))
        return null;
    const message = getLoadingMessage(key);
    const progress = getLoadingProgress(key);
    const error = getLoadingError(key);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex items-center space-x-2 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-gaming-primary" }), message && (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: message }), progress !== undefined && ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gaming-primary h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })), error && (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-400", children: error })] }));
};
exports.LoadingIndicator = LoadingIndicator;
// Global loading overlay
const GlobalLoadingOverlay = () => {
    const { isLoading } = (0, exports.useLoading)();
    if (!isLoading())
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-6 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-gaming-primary" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: "Loading..." })] }) }) }));
};
exports.GlobalLoadingOverlay = GlobalLoadingOverlay;
