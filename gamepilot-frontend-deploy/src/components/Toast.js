"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastContainer = exports.toast = exports.setGlobalToastContext = exports.ToastProvider = exports.useToast = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ToastContext = (0, react_1.createContext)(undefined);
const useToast = () => {
    const context = (0, react_1.useContext)(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
exports.useToast = useToast;
const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const addToast = (0, react_1.useCallback)((toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = {
            ...toast,
            id,
            duration: toast.duration ?? 5000
        };
        setToasts(prev => [...prev, newToast]);
        // Auto remove after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, newToast.duration);
    }, []);
    const removeToast = (0, react_1.useCallback)((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);
    const clearAllToasts = (0, react_1.useCallback)(() => {
        setToasts([]);
    }, []);
    // Set global context reference for external calls
    const contextValue = { toasts, addToast, removeToast, clearAllToasts };
    (0, react_1.useEffect)(() => {
        (0, exports.setGlobalToastContext)(contextValue);
    }, [contextValue]);
    return ((0, jsx_runtime_1.jsxs)(ToastContext.Provider, { value: contextValue, children: [children, (0, jsx_runtime_1.jsx)(ToastContainer, {})] }));
};
exports.ToastProvider = ToastProvider;
const ToastContainer = () => {
    const { toasts, removeToast } = (0, exports.useToast)();
    if (toasts.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: toasts.map((toast, index) => ((0, jsx_runtime_1.jsx)(ToastItem, { toast: toast, onRemove: removeToast, isVisible: index === 0 }, toast.id))) }));
};
exports.ToastContainer = ToastContainer;
const ToastItem = ({ toast, onRemove, isVisible }) => {
    const [isLeaving, setIsLeaving] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!isVisible && !isLeaving) {
            setIsLeaving(true);
            setTimeout(() => {
                onRemove(toast.id);
            }, 300);
        }
    }, [isVisible, isLeaving, onRemove, toast.id]);
    const getToastStyles = (type) => {
        const baseStyles = "border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md backdrop-blur-sm bg-opacity-90";
        const typeStyles = {
            success: "bg-green-500 border-green-600 text-white",
            error: "bg-red-500 border-red-600 text-white",
            warning: "bg-yellow-500 border-yellow-600 text-black",
            info: "bg-blue-500 border-blue-600 text-white"
        };
        return `${baseStyles} ${typeStyles[type]}`;
    };
    const getIcon = (type) => {
        const icons = {
            success: "✓",
            error: "✕",
            warning: "⚠",
            info: "ℹ"
        };
        return icons[type];
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `
        ${getToastStyles(toast.type)}
        transform transition-all duration-300 ease-in-out
        ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 text-lg font-bold", children: getIcon(toast.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-sm", children: toast.title }), toast.message && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm opacity-90 mt-1", children: toast.message })), toast.action && ((0, jsx_runtime_1.jsx)("button", { onClick: toast.action.onClick, className: "mt-2 text-xs underline hover:no-underline focus:outline-none", children: toast.action.label }))] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                        setIsLeaving(true);
                        setTimeout(() => onRemove(toast.id), 300);
                    }, className: "flex-shrink-0 ml-4 text-lg hover:opacity-70 transition-opacity focus:outline-none", "aria-label": "Close toast", children: "\u00D7" })] }) }));
};
// Global toast reference for external calls
let globalToastContext = null;
const setGlobalToastContext = (context) => {
    globalToastContext = context;
};
exports.setGlobalToastContext = setGlobalToastContext;
// Global toast object that can be called outside React components
exports.toast = {
    success: (title, message, duration) => {
        if (globalToastContext) {
            globalToastContext.addToast({ type: 'success', title, message, duration: duration ?? 5000 });
        }
        else {
            console.warn('Toast context not available:', { type: 'success', title, message, duration });
        }
    },
    error: (title, message, duration) => {
        if (globalToastContext) {
            globalToastContext.addToast({ type: 'error', title, message, duration: duration ?? 8000 });
        }
        else {
            console.warn('Toast context not available:', { type: 'error', title, message, duration });
        }
    },
    warning: (title, message, duration) => {
        if (globalToastContext) {
            globalToastContext.addToast({ type: 'warning', title, message, duration });
        }
        else {
            console.warn('Toast context not available:', { type: 'warning', title, message, duration });
        }
    },
    info: (title, message, duration) => {
        if (globalToastContext) {
            globalToastContext.addToast({ type: 'info', title, message, duration });
        }
        else {
            console.warn('Toast context not available:', { type: 'info', title, message, duration });
        }
    }
};
