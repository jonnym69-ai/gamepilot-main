"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailerPlayer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TrailerPlayer = ({ movies }) => {
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [currentMovie, setCurrentMovie] = (0, react_1.useState)(0);
    const videoRef = (0, react_1.useRef)(null);
    if (!movies || movies.length === 0) {
        return null;
    }
    const movie = movies[currentMovie];
    const videoSrc = videoRef.current?.canPlayType('video/webm') ? movie.webm.max : movie.mp4.max;
    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };
    const nextMovie = () => {
        setCurrentMovie((prev) => (prev + 1) % movies.length);
        setIsPlaying(false);
    };
    const prevMovie = () => {
        setCurrentMovie((prev) => (prev - 1 + movies.length) % movies.length);
        setIsPlaying(false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden group", children: [!isPlaying ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full h-full", children: [(0, jsx_runtime_1.jsx)("img", { src: movie.thumbnail, alt: movie.name, className: "w-full h-full object-cover" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: handlePlay, className: "w-20 h-20 bg-gaming-accent hover:bg-gaming-primary rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 ml-1", fill: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { d: "M8 5v14l11-7z" }) }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-4 left-4 text-white", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: movie.name }) })] })) : ((0, jsx_runtime_1.jsx)("video", { ref: videoRef, src: videoSrc, className: "w-full h-full object-cover", controls: true, onPause: handlePause, onEnded: () => setIsPlaying(false) })), movies.length > 1 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: prevMovie, className: "absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), (0, jsx_runtime_1.jsx)("button", { onClick: nextMovie, className: "absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] })), movies.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm", children: [currentMovie + 1, " / ", movies.length] }))] }));
};
exports.TrailerPlayer = TrailerPlayer;
