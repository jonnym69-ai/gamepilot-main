"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingOverlay = exports.ListSkeleton = exports.GameCardSkeleton = exports.CardSkeleton = exports.LoadingSkeleton = exports.PageLoading = exports.Loading = exports.LoadingSpinner = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `inline-block animate-spin ${sizeClasses[size]} ${className}`, children: (0, jsx_runtime_1.jsxs)("svg", { className: "w-full h-full text-gaming-primary", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }));
};
exports.LoadingSpinner = LoadingSpinner;
const Loading = ({ children, message = 'Loading...', size = 'lg', fullScreen = false, className = '' }) => {
    const content = ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center space-y-4 ${className}`, children: [(0, jsx_runtime_1.jsx)(exports.LoadingSpinner, { size: size }), message && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-center animate-pulse", children: message })), children] }));
    if (fullScreen) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker z-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 border border-white/10", children: content }) }));
    }
    return content;
};
exports.Loading = Loading;
// Page-level loading component
const PageLoading = ({ message = 'Loading page...' }) => ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 border border-white/10", children: (0, jsx_runtime_1.jsx)(exports.Loading, { message: message, size: "xl" }) }) }));
exports.PageLoading = PageLoading;
// Component-level loading skeleton
const LoadingSkeleton = ({ lines = 3, className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `space-y-3 ${className}`, children: Array.from({ length: lines }).map((_, index) => ((0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded-lg w-full" }) }, index))) }));
exports.LoadingSkeleton = LoadingSkeleton;
// Card loading skeleton
const CardSkeleton = ({ className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-6 border border-white/10 ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-700 rounded-lg w-3/4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded-lg w-full" }) }), (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded-lg w-5/6" }) })] }) }));
exports.CardSkeleton = CardSkeleton;
// Game card loading skeleton
const GameCardSkeleton = ({ className = '' }) => ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl overflow-hidden border border-white/10 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "aspect-video bg-gray-700 animate-pulse" }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-gray-700 rounded-lg w-3/4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded-lg w-full" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-700 rounded-lg w-16" }) }), (0, jsx_runtime_1.jsx)("div", { className: "animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-700 rounded-lg w-12" }) })] })] })] }));
exports.GameCardSkeleton = GameCardSkeleton;
// List loading skeleton
const ListSkeleton = ({ items = 5, className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `space-y-4 ${className}`, children: Array.from({ length: items }).map((_, index) => ((0, jsx_runtime_1.jsx)(exports.CardSkeleton, {}, index))) }));
exports.ListSkeleton = ListSkeleton;
// Loading overlay for components
const LoadingOverlay = ({ isLoading, children, message }) => ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [children, isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsx)(exports.LoadingSpinner, { size: "md" }), message && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm mt-2", children: message }))] }) }))] }));
exports.LoadingOverlay = LoadingOverlay;
