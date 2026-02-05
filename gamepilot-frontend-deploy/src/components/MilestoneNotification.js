"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMilestoneNotifications = exports.MilestoneNotification = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MilestoneNotification = ({ milestones, onClose, isOpen }) => {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [isAnimating, setIsAnimating] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isOpen && milestones.length > 0) {
            setIsAnimating(true);
            setCurrentIndex(0);
        }
    }, [isOpen, milestones]);
    const handleNext = () => {
        if (currentIndex < milestones.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnimating(true);
        }
        else {
            onClose();
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsAnimating(true);
        }
    };
    const currentMilestone = milestones[currentIndex];
    if (!isOpen || !currentMilestone)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl max-w-md w-full border border-purple-500/30 shadow-2xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-purple-500/20", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-1", children: "Milestone Unlocked!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-purple-300 text-sm", children: "Your gaming identity evolves" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-purple-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: `text-center transition-all duration-500 ${isAnimating ? 'scale-105' : 'scale-100'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4 animate-bounce", children: currentMilestone.icon }), (0, jsx_runtime_1.jsx)("h4", { className: "text-xl font-bold text-white mb-2", style: { color: currentMilestone.color }, children: currentMilestone.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm mb-4", children: currentMilestone.description }), (0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-purple-300 uppercase tracking-wide", children: currentMilestone.category }) }), milestones.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2 text-gray-400 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: currentIndex + 1 }), (0, jsx_runtime_1.jsx)("span", { children: "/" }), (0, jsx_runtime_1.jsx)("span", { children: milestones.length })] }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-t border-purple-500/20", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handlePrevious, disabled: currentIndex === 0, className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed", children: "Previous" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: milestones.map((_, index) => ((0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full transition-colors ${index === currentIndex ? currentMilestone.color : 'bg-gray-600'}` }, index))) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleNext, className: "px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all", children: currentIndex === milestones.length - 1 ? 'Finish' : 'Next' })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none overflow-hidden rounded-2xl", children: (0, jsx_runtime_1.jsx)("div", { className: "confetti-container", children: [...Array(20)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "confetti", style: {
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`,
                                    backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#ec4899'][Math.floor(Math.random() * 5)]
                                } }, i))) }) })] }), (0, jsx_runtime_1.jsx)("style", { jsx: true, children: `
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .confetti {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: confetti-fall linear infinite;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      ` })] }));
};
exports.MilestoneNotification = MilestoneNotification;
/**
 * Hook to show milestone notifications
 */
const useMilestoneNotifications = () => {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [isNotificationOpen, setIsNotificationOpen] = (0, react_1.useState)(false);
    const showNotifications = (newMilestones) => {
        if (newMilestones.length > 0) {
            setNotifications(newMilestones);
            setIsNotificationOpen(true);
        }
    };
    const closeNotifications = () => {
        setIsNotificationOpen(false);
        setTimeout(() => setNotifications([]), 300);
    };
    return {
        notifications,
        isNotificationOpen,
        showNotifications,
        closeNotifications
    };
};
exports.useMilestoneNotifications = useMilestoneNotifications;
