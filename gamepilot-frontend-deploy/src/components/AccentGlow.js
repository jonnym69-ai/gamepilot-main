"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccentGlow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const AccentGlow = ({ children, color = 'accent', size = 'md', intensity = 'medium' }) => {
    const glowClass = `${color}-${size}-${intensity}`;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative ${glowClass}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 pointer-events-none ${glowClass}` }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10", children: children })] }));
};
exports.AccentGlow = AccentGlow;
