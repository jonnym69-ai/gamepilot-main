"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Card = ({ children, className, variant = 'default' }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('rounded-lg p-4', {
            'bg-white/10 backdrop-blur-md border border-white/20': variant === 'glass',
            'bg-gray-900': variant === 'solid',
            'bg-gray-800': variant === 'default',
        }, className), children: children }));
};
exports.Card = Card;
