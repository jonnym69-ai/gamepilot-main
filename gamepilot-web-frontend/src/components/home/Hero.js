"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hero = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Hero = ({ userName, topGenres = [] }) => {
    // Dynamic background based on top genres
    const getBackgroundGradient = () => {
        if (topGenres.includes('RPG')) {
            return 'from-purple-900 via-purple-800 to-indigo-900';
        }
        if (topGenres.includes('Action')) {
            return 'from-red-900 via-orange-800 to-yellow-900';
        }
        if (topGenres.includes('Strategy')) {
            return 'from-blue-900 via-cyan-800 to-teal-900';
        }
        if (topGenres.includes('Simulation')) {
            return 'from-green-900 via-emerald-800 to-cyan-900';
        }
        return 'from-gaming-dark via-gray-900 to-gaming-darker';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative h-96 overflow-hidden bg-gradient-to-br ${getBackgroundGradient()}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-20 left-10 w-32 h-32 bg-gaming-accent/10 rounded-full blur-xl animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-40 right-20 w-48 h-48 bg-gaming-primary/10 rounded-full blur-2xl animate-pulse", style: { animationDelay: '1s' } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-20 left-1/4 w-64 h-64 bg-gaming-secondary/10 rounded-full blur-3xl animate-pulse", style: { animationDelay: '2s' } })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 h-full flex flex-col justify-center items-center px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center max-w-4xl", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-6xl font-bold text-white mb-4 animate-fade-in", children: ["Welcome back, ", userName] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-gray-200 mb-8 animate-fade-in", style: { animationDelay: '200ms' }, children: "Ready to dive into your gaming universe?" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 animate-fade-in", style: { animationDelay: '400ms' }, children: [(0, jsx_runtime_1.jsx)("button", { className: "px-8 py-3 bg-gaming-accent hover:bg-gaming-primary text-white rounded-lg font-semibold transition-all transform hover:scale-105", children: "\uD83C\uDFAE Continue Playing" }), (0, jsx_runtime_1.jsx)("button", { className: "px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105", children: "\uD83D\uDCDA Browse Library" })] })] }) })] }));
};
exports.Hero = Hero;
