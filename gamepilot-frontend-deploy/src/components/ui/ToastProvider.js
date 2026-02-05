"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toastMessages = exports.ToastProvider = exports.useToast = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
const ToastContext = (0, react_1.createContext)(undefined);
const useToast = () => {
    const context = (0, react_1.useContext)(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
exports.useToast = useToast;
const ToastProvider = ({ children, defaultPosition = 'top-right', defaultTheme = 'dark' }) => {
    const showToast = (0, react_1.useCallback)((message, options = {}) => {
        const { type = 'info', position = defaultPosition, autoClose = 5000, hideProgressBar = false, closeOnClick = true, pauseOnHover = true, draggable = true, theme = defaultTheme } = options;
        const toastMethods = {
            success: react_toastify_1.toast.success,
            error: react_toastify_1.toast.error,
            warning: react_toastify_1.toast.warning,
            info: react_toastify_1.toast.info
        };
        const toastMethod = toastMethods[type];
        const id = toastMethod(message, {
            position,
            autoClose,
            hideProgressBar,
            closeOnClick,
            pauseOnHover,
            draggable,
            theme
        });
        return id;
    }, [defaultPosition, defaultTheme]);
    const showSuccess = (0, react_1.useCallback)((message, options = {}) => {
        return showToast(message, { ...options, type: 'success' });
    }, [showToast]);
    const showError = (0, react_1.useCallback)((message, options = {}) => {
        return showToast(message, { ...options, type: 'error', autoClose: false });
    }, [showToast]);
    const showWarning = (0, react_1.useCallback)((message, options = {}) => {
        return showToast(message, { ...options, type: 'warning' });
    }, [showToast]);
    const showInfo = (0, react_1.useCallback)((message, options = {}) => {
        return showToast(message, { ...options, type: 'info' });
    }, [showToast]);
    const clearToasts = (0, react_1.useCallback)(() => {
        react_toastify_1.toast.dismiss();
    }, []);
    const value = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearToasts
    };
    return ((0, jsx_runtime_1.jsxs)(ToastContext.Provider, { value: value, children: [children, (0, jsx_runtime_1.jsx)(react_toastify_1.ToastContainer, { position: defaultPosition, autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: defaultTheme, limit: 3 })] }));
};
exports.ToastProvider = ToastProvider;
// Utility functions for common toast messages
exports.toastMessages = {
    // Game Management
    gameAdded: (title) => `✅ "${title}" added to your library`,
    gameUpdated: (title) => `✅ "${title}" updated successfully`,
    gameDeleted: (title) => `🗑️ "${title}" removed from your library`,
    gamesBulkDeleted: (count) => `🗑️ ${count} games removed from your library`,
    // Error Messages
    gameAddFailed: (title) => `❌ Failed to add "${title}" to library`,
    gameUpdateFailed: (title) => `❌ Failed to update "${title}"`,
    gameDeleteFailed: (title) => `❌ Failed to remove "${title}"`,
    loadFailed: (operation) => `❌ Failed to load ${operation}`,
    saveFailed: (operation) => `❌ Failed to save ${operation}`,
    // Success Messages
    saveSuccess: (operation) => `✅ ${operation} saved successfully`,
    loadSuccess: (operation) => `✅ ${operation} loaded successfully`,
    operationComplete: (operation) => `✅ ${operation} completed`,
    // Info Messages
    loading: (operation) => `⏳ Loading ${operation}...`,
    processing: (operation) => `⚙️ Processing ${operation}...`,
    noResults: (search) => `🔍 No results found for "${search}"`,
    // Warning Messages
    unsavedChanges: '⚠️ You have unsaved changes',
    confirmDelete: '⚠️ Are you sure you want to delete this item?',
    networkError: '⚠️ Network connection issue',
    // Recommendations
    recommendationGenerated: '🎯 New recommendations generated',
    recommendationFailed: '❌ Failed to generate recommendations',
    noRecommendations: '📭 No recommendations available'
};
