"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const EnhancedButton = ({ children, to, onClick, variant = 'primary', size = 'md', className = '' }) => {
    const baseClasses = 'gaming-button hover-scale transition-all duration-300';
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };
    const buttonContent = ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `${baseClasses} ${sizeClasses[size]} ${className}`, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, transition: { type: "spring", stiffness: 400, damping: 17 }, children: children }));
    if (to) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: to, children: buttonContent });
    }
    return ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, className: "inline-block", children: buttonContent }));
};
exports.EnhancedButton = EnhancedButton;
