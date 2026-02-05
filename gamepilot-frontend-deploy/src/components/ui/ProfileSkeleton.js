"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSkeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ProfileSkeleton = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-700 animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-2 right-2 w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-700 animate-pulse", children: (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-gray-500 rounded-full" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-700 rounded mb-2 animate-pulse" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-gray-600 rounded-full animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-24 bg-gray-700 rounded animate-pulse" })] })] })] }));
};
exports.ProfileSkeleton = ProfileSkeleton;
