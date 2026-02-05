"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightPopover = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const InsightPopover = ({ isOpen, onClose, title, description, children, position = 'center' }) => {
    const [isAnimating, setIsAnimating] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
        else {
            setIsAnimating(false);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in", onClick: handleBackdropClick }), (0, jsx_runtime_1.jsx)("div", { className: `fixed z-50 ${position === 'bottom' ? 'bottom-0 left-0 right-0' : 'inset-0 flex items-center justify-center'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: `
            glass-morphism rounded-2xl border border-white/20 shadow-2xl
            ${position === 'bottom' ? 'mx-4 mb-4' : 'mx-4 max-w-lg w-full'}
            ${isAnimating ? 'animate-scale-in' : 'animate-scale-out'}
            transition-all duration-300
          `, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-colors duration-200", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\u00D7" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: description }), children && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: children }))] })] }) })] }));
};
exports.InsightPopover = InsightPopover;
