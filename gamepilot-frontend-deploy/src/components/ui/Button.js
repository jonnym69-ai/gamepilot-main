"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Button = ({ children, onClick, className, variant = 'default', disabled = false, type = 'button', ...props }) => {
    return ((0, jsx_runtime_1.jsx)("button", { type: type, onClick: onClick, disabled: disabled, className: (0, clsx_1.default)('px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2', {
            'bg-blue-500 hover:bg-blue-600 text-white': variant === 'default',
            'bg-red-500 hover:bg-red-600 text-white': variant === 'destructive',
            'bg-gray-600 hover:bg-gray-700 text-white': variant === 'secondary',
            'opacity-50 cursor-not-allowed': disabled,
        }, className), ...props, children: children }));
};
exports.Button = Button;
