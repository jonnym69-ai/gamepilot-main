"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const HelpCard = ({ children, className = '' }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 ${className}`, children: children }));
};
exports.HelpCard = HelpCard;
