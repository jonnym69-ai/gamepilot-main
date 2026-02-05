"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PriceBadge = ({ priceInfo }) => {
    if (!priceInfo) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg", children: (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Price not available" }) }));
    }
    if (priceInfo.isFree) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg", children: (0, jsx_runtime_1.jsx)("span", { className: "text-green-400 font-bold text-lg", children: "Free to Play" }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center gap-3 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg", children: priceInfo.discount_percent > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 line-through text-sm", children: [priceInfo.currency, " ", (priceInfo.initial / 100).toFixed(2)] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-bold text-lg", children: [priceInfo.currency, " ", (priceInfo.final / 100).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-2 py-1 bg-red-500 rounded text-white font-bold text-sm", children: ["-", priceInfo.discount_percent, "%"] })] })) : ((0, jsx_runtime_1.jsxs)("span", { className: "text-white font-bold text-lg", children: [priceInfo.currency, " ", (priceInfo.final / 100).toFixed(2)] })) }));
};
exports.PriceBadge = PriceBadge;
