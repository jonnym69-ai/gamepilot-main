"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Badge = ({ children, className, variant = 'default' }) => {
    return ((0, jsx_runtime_1.jsx)("span", { className: (0, clsx_1.default)('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', {
            'bg-blue-500/20 text-blue-300 border border-blue-500/30': variant === 'default',
            'bg-green-500/20 text-green-300 border border-green-500/30': variant === 'success',
            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30': variant === 'warning',
            'bg-red-500/20 text-red-300 border border-red-500/30': variant === 'error',
            'bg-gray-500/20 text-gray-300 border border-gray-500/30': variant === 'secondary',
        }, className), children: children }));
};
exports.Badge = Badge;
