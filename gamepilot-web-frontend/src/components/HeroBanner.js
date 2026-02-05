"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroBanner = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const AccentGlow_1 = require("./AccentGlow");
const HeroBanner = ({ title, subtitle, backgroundImage = 'https://via.placeholder.com/1920x400/1e3a8a/ffffff?text=Hero+Background' }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative h-96 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 w-full h-full", style: {
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 h-full flex flex-col justify-center items-center px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center max-w-4xl animate-fade-in", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-6xl font-bold text-white mb-4 animate-fade-in animate-delay-200", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-white/90 mb-8 animate-fade-in animate-delay-300", children: subtitle })] }) }), (0, jsx_runtime_1.jsx)(AccentGlow_1.AccentGlow, { color: "accent-light", size: "lg", intensity: "medium", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 w-full h-full animate-glow-pulse" }) }) })] }));
};
exports.HeroBanner = HeroBanner;
