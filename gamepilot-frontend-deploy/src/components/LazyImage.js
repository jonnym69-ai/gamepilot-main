"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyImage = LazyImage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useMemoryOptimization_1 = require("../hooks/useMemoryOptimization");
function LazyImage({ src, alt, className = '', onLoad, onError, objectFit = 'cover' }) {
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const [isInView, setIsInView] = (0, react_1.useState)(false);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const containerRef = (0, react_1.useRef)(null);
    // Use memory-optimized intersection observer
    const { observe, unobserve } = (0, useMemoryOptimization_1.useIntersectionObserver)((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setIsInView(true);
                if (containerRef.current) {
                    unobserve(containerRef.current);
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });
    (0, react_1.useEffect)(() => {
        if (containerRef.current) {
            observe(containerRef.current);
        }
        return () => {
            if (containerRef.current) {
                unobserve(containerRef.current);
            }
        };
    }, [observe, unobserve]);
    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };
    const handleError = () => {
        setHasError(true);
        onError?.();
    };
    // Preload image when in view using memory-optimized caching
    (0, react_1.useEffect)(() => {
        if (isInView && !hasError) {
            (0, useMemoryOptimization_1.preloadImage)(src)
                .then(handleLoad)
                .catch(handleError);
        }
    }, [isInView, src, hasError]);
    return ((0, jsx_runtime_1.jsxs)("div", { ref: containerRef, className: `relative aspect-square overflow-hidden ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: `
          absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black 
          flex items-center justify-center transition-all duration-500
          ${isLoaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-4xl text-gray-600", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 blur-lg bg-gaming-primary/10 scale-150" })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-2 left-0 right-0 flex justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-1 bg-gray-700 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full w-3/5 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-full" }) }) })] }), isInView && !hasError && ((0, jsx_runtime_1.jsx)("img", { src: src, alt: alt, className: `
            absolute inset-0 w-full h-full object-center transition-opacity duration-500
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `, onLoad: () => setIsLoaded(true), onError: () => setHasError(true), loading: "lazy", decoding: "async", sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", style: {
                    imageRendering: 'auto',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    willChange: 'opacity'
                } })), hasError && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-red-900/30 flex flex-col items-center justify-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl text-red-500", children: "\uD83D\uDEAB" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 blur-lg bg-red-500/10 scale-150" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-red-400 mt-2 font-medium", children: "Failed to load" })] })), isLoaded && !hasError && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" })] }))] }));
}
