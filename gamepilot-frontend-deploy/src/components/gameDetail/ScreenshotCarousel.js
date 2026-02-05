"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotCarousel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ScreenshotCarousel = ({ screenshots }) => {
    const [currentImage, setCurrentImage] = (0, react_1.useState)(0);
    if (!screenshots || screenshots.length === 0) {
        return null;
    }
    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % screenshots.length);
    };
    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden group", children: [(0, jsx_runtime_1.jsx)("img", { src: screenshots[currentImage].path_full, alt: `Screenshot ${currentImage + 1}`, className: "w-full h-full object-cover" }), screenshots.length > 1 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: prevImage, className: "absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), (0, jsx_runtime_1.jsx)("button", { onClick: nextImage, className: "absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] })), screenshots.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm", children: [currentImage + 1, " / ", screenshots.length] })), screenshots.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 left-4 flex gap-2", children: [screenshots.slice(0, 5).map((screenshot, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentImage(index), className: `w-12 h-12 rounded border-2 transition-all ${index === currentImage
                            ? 'border-gaming-accent scale-110'
                            : 'border-transparent hover:border-gray-400'}`, children: (0, jsx_runtime_1.jsx)("img", { src: screenshot.path_thumbnail, alt: `Thumbnail ${index + 1}`, className: "w-full h-full object-cover rounded" }) }, screenshot.id))), screenshots.length > 5 && ((0, jsx_runtime_1.jsxs)("div", { className: "w-12 h-12 rounded border-2 border-gray-600 flex items-center justify-center text-gray-400 text-xs", children: ["+", screenshots.length - 5] }))] }))] }));
};
exports.ScreenshotCarousel = ScreenshotCarousel;
