"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const Input = ({ type = 'text', placeholder, value, onChange, className }) => {
    return ((0, jsx_runtime_1.jsx)("input", { type: type, placeholder: placeholder, value: value, onChange: onChange, className: (0, clsx_1.default)('w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500', className) }));
};
exports.Input = Input;
