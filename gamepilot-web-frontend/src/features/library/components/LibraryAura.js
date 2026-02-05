"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryAura = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LibraryAura = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 pointer-events-none z-0 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-pink-900/10" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: [...Array(8)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "absolute w-1 h-1 bg-white/10 rounded-full animate-pulse", style: {
                        left: `${10 + i * 12}%`,
                        top: `${20 + (i % 3) * 30}%`,
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: '4s'
                    } }, i))) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-30", style: {
                            background: 'radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
                            filter: 'blur(60px)'
                        } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-30", style: {
                            background: 'radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                            filter: 'blur(80px)'
                        } })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-5", style: {
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                    backgroundSize: '100px 100px'
                } })] }));
};
exports.LibraryAura = LibraryAura;
