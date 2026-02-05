"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedSkeleton = exports.AnimatedBadge = exports.AnimatedList = exports.AnimatedFab = exports.AnimatedNotification = exports.AnimatedProgressBar = exports.AnimatedStats = exports.AnimatedLoading = exports.AnimatedMoodButton = exports.AnimatedGameCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// Animated Components for GamePilot - Micro-interactions & Polish
const react_1 = require("react");
const useAnimations_1 = require("../hooks/useAnimations");
const AnimatedGameCard = ({ game, onClick, className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    const { isHovered, handlers } = (0, useAnimations_1.useHoverAnimation)();
    const { ripples } = (0, useAnimations_1.useRippleEffect)();
    return ((0, jsx_runtime_1.jsxs)("div", { ref: ref, className: `
        relative overflow-hidden rounded-xl cursor-pointer
        transition-all duration-300 ease-out
        ${hasIntersected ? 'animate-fade-in' : 'opacity-0'}
        ${isHovered ? 'transform scale-105 shadow-2xl' : 'transform scale-100 shadow-lg'}
        ${className}
      `, onClick: onClick, ...handlers, children: [ripples.map(ripple => ((0, jsx_runtime_1.jsx)("span", { className: "absolute bg-white/30 rounded-full animate-ping", style: {
                    left: ripple.x - ripple.size / 2,
                    top: ripple.y - ripple.size / 2,
                    width: ripple.size,
                    height: ripple.size
                } }, ripple.id))), (0, jsx_runtime_1.jsxs)("div", { className: "relative h-48 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover transition-transform duration-500 ease-out", style: { transform: isHovered ? 'scale(1.1)' : 'scale(1)' } }), (0, jsx_runtime_1.jsx)("div", { className: `
          absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-70'}
        `, children: (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-bold text-lg mb-1", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-sm", children: game.genre })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-white/10 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center text-white/80 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: game.status }), (0, jsx_runtime_1.jsxs)("span", { children: [game.playtime, "h"] })] }) }), isHovered && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-xl border-2 border-purple-500/50 animate-glow pointer-events-none" }))] }));
};
exports.AnimatedGameCard = AnimatedGameCard;
const AnimatedMoodButton = ({ mood, emoji, isSelected, onClick, className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    const { isHovered, handlers } = (0, useAnimations_1.useHoverAnimation)();
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, onClick: onClick, className: `
        relative p-4 rounded-xl border-2 transition-all duration-300 ease-out
        ${hasIntersected ? 'animate-slide-in-up' : 'opacity-0 translate-y-4'}
        ${isSelected
            ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30 animate-glow'
            : 'border-white/20 bg-white/10 hover:border-purple-400 hover:bg-purple-400/10'}
        ${isHovered ? 'transform scale-110 -translate-y-2' : 'transform scale-100'}
        ${className}
      `, ...handlers, children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl mb-2", children: emoji }), (0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium", children: mood })] }), isSelected && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }))] }));
};
exports.AnimatedMoodButton = AnimatedMoodButton;
const AnimatedLoading = ({ message = 'Loading...', size = 'medium', className = '' }) => {
    const { displayedText, isTyping } = (0, useAnimations_1.useTypingAnimation)(message, 50, 300);
    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center space-y-4 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `
        ${sizeClasses[size]} 
        border-2 border-white/20 border-t-white rounded-full
        animate-spin
      ` }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white/80 text-sm", children: [displayedText, isTyping && (0, jsx_runtime_1.jsx)("span", { className: "animate-pulse", children: "|" })] })] }));
};
exports.AnimatedLoading = AnimatedLoading;
const AnimatedStats = ({ stats, className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: `grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`, children: stats.map((stat, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `
            bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center
            transition-all duration-500 ease-out delay-100
            ${hasIntersected ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-4'}
          `, style: { animationDelay: `${index * 100}ms` }, children: [stat.icon && ((0, jsx_runtime_1.jsx)("div", { className: "text-2xl mb-2", children: stat.icon })), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white mb-1", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/60 text-sm", children: stat.label })] }, stat.label))) }));
};
exports.AnimatedStats = AnimatedStats;
const AnimatedProgressBar = ({ value, max, label, color = 'bg-purple-500', className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    const [animatedValue, setAnimatedValue] = (0, react_1.useState)(0);
    const percentage = Math.min((value / max) * 100, 100);
    (0, react_1.useEffect)(() => {
        if (hasIntersected) {
            const timer = setTimeout(() => {
                setAnimatedValue(percentage);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [hasIntersected, percentage]);
    return ((0, jsx_runtime_1.jsxs)("div", { ref: ref, className: `space-y-2 ${className}`, children: [label && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-white/80", children: [(0, jsx_runtime_1.jsx)("span", { children: label }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(animatedValue), "%"] })] })), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-white/20 rounded-full h-2 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `
            h-full rounded-full transition-all duration-1000 ease-out
            ${color}
            ${hasIntersected ? 'animate-slide-in-left' : 'translate-x-full opacity-0'}
          `, style: { width: `${animatedValue}%` } }) })] }));
};
exports.AnimatedProgressBar = AnimatedProgressBar;
const AnimatedNotification = ({ type, message, onClose, className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };
    const typeStyles = {
        success: 'bg-green-500/20 border-green-500 text-green-300',
        error: 'bg-red-500/20 border-red-500 text-red-300',
        warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
        info: 'bg-blue-500/20 border-blue-500 text-blue-300'
    };
    const typeIcons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: `
        relative p-4 rounded-lg border backdrop-blur-sm
        transition-all duration-300 ease-out
        ${hasIntersected && isVisible ? 'animate-slide-in-right opacity-100' : 'opacity-0 translate-x-full'}
        ${!isVisible ? 'animate-slide-out-right opacity-0' : ''}
        ${typeStyles[type]}
        ${className}
      `, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm", children: typeIcons[type] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: message }) }), onClose && ((0, jsx_runtime_1.jsx)("button", { onClick: handleClose, className: "flex-shrink-0 w-4 h-4 rounded hover:bg-current/20 transition-colors", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-full h-full", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) }))] }) }));
};
exports.AnimatedNotification = AnimatedNotification;
const AnimatedFab = ({ icon, onClick, position = 'bottom-right', className = '' }) => {
    const { isHovered, handlers } = (0, useAnimations_1.useHoverAnimation)();
    const { ripples, createRipple } = (0, useAnimations_1.useRippleEffect)();
    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6'
    };
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: (e) => {
            createRipple(e);
            onClick();
        }, className: `
        fixed w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500
        rounded-full shadow-lg flex items-center justify-center
        transition-all duration-300 ease-out
        ${positionClasses[position]}
        ${isHovered ? 'transform scale-110 shadow-2xl' : 'transform scale-100'}
        ${className}
      `, ...handlers, children: [ripples.map(ripple => ((0, jsx_runtime_1.jsx)("span", { className: "absolute bg-white/30 rounded-full animate-ping", style: {
                    left: ripple.x - ripple.size / 2,
                    top: ripple.y - ripple.size / 2,
                    width: ripple.size,
                    height: ripple.size
                } }, ripple.id))), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 text-white", children: icon }), isHovered && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full bg-white/20 animate-pulse" }))] }));
};
exports.AnimatedFab = AnimatedFab;
const AnimatedList = ({ items, className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: `space-y-2 ${className}`, children: items.map((item, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `
            flex items-center space-x-3 p-3 rounded-lg
            bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out
            ${hasIntersected ? 'animate-slide-in-left opacity-100' : 'opacity-0 -translate-x-4'}
          `, style: { animationDelay: `${index * 50}ms` }, children: [item.icon && ((0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300", children: item.icon })), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 text-white/80", children: item.content })] }, item.id))) }));
};
exports.AnimatedList = AnimatedList;
const AnimatedBadge = ({ count, max = 99, className = '' }) => {
    const { ref, hasIntersected } = (0, useAnimations_1.useIntersectionObserver)();
    const displayCount = count > max ? `${max}+` : count.toString();
    if (count === 0)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { ref: ref, className: `
        relative inline-flex items-center justify-center
        w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full
        transition-all duration-300 ease-out
        ${hasIntersected ? 'animate-scale-in' : 'scale-0 opacity-0'}
        ${className}
      `, children: [displayCount, hasIntersected && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full bg-red-500 animate-ping" }))] }));
};
exports.AnimatedBadge = AnimatedBadge;
const AnimatedSkeleton = ({ lines = 3, className = '' }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `space-y-2 ${className}`, children: Array.from({ length: lines }).map((_, index) => ((0, jsx_runtime_1.jsx)("div", { className: `
            h-4 bg-white/20 rounded-full
            ${index === lines - 1 ? 'w-3/4' : 'w-full'}
            loading-skeleton
          ` }, index))) }));
};
exports.AnimatedSkeleton = AnimatedSkeleton;
exports.default = {
    AnimatedGameCard: exports.AnimatedGameCard,
    AnimatedMoodButton: exports.AnimatedMoodButton,
    AnimatedLoading: exports.AnimatedLoading,
    AnimatedStats: exports.AnimatedStats,
    AnimatedProgressBar: exports.AnimatedProgressBar,
    AnimatedNotification: exports.AnimatedNotification,
    AnimatedFab: exports.AnimatedFab,
    AnimatedList: exports.AnimatedList,
    AnimatedBadge: exports.AnimatedBadge,
    AnimatedSkeleton: exports.AnimatedSkeleton
};
