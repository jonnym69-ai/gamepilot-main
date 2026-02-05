"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = PerformanceMonitor;
exports.useVirtualScrollMetrics = useVirtualScrollMetrics;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function PerformanceMonitor({ totalGames, renderedGames }) {
    const [metrics, setMetrics] = (0, react_1.useState)({
        memoryUsage: 0,
        totalGames,
        renderedGames,
        scrollPosition: 0,
        fps: 60
    });
    const frameCountRef = (0, react_1.useRef)(0);
    const lastTimeRef = (0, react_1.useRef)(performance.now());
    const animationFrameRef = (0, react_1.useRef)();
    // Monitor FPS
    (0, react_1.useEffect)(() => {
        const measureFPS = () => {
            frameCountRef.current++;
            const currentTime = performance.now();
            if (currentTime >= lastTimeRef.current + 1000) {
                const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
                setMetrics(prev => ({
                    ...prev,
                    fps
                }));
                frameCountRef.current = 0;
                lastTimeRef.current = currentTime;
            }
            animationFrameRef.current = requestAnimationFrame(measureFPS);
        };
        animationFrameRef.current = requestAnimationFrame(measureFPS);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);
    // Monitor memory usage
    (0, react_1.useEffect)(() => {
        const measureMemory = () => {
            if ('memory' in performance) {
                const memory = performance.memory;
                const memoryUsage = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
                setMetrics(prev => ({
                    ...prev,
                    memoryUsage
                }));
            }
        };
        const interval = setInterval(measureMemory, 2000);
        return () => clearInterval(interval);
    }, []);
    // Update game counts
    (0, react_1.useEffect)(() => {
        setMetrics(prev => ({
            ...prev,
            totalGames,
            renderedGames
        }));
    }, [totalGames, renderedGames]);
    // Monitor scroll position
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setMetrics(prev => ({
                ...prev,
                scrollPosition: window.scrollY
            }));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Memory optimization warnings
    const getMemoryStatus = () => {
        if (metrics.memoryUsage > 150)
            return { status: 'critical', color: 'text-red-500' };
        if (metrics.memoryUsage > 100)
            return { status: 'warning', color: 'text-yellow-500' };
        return { status: 'good', color: 'text-green-500' };
    };
    const getFPSStatus = () => {
        if (metrics.fps < 30)
            return { status: 'poor', color: 'text-red-500' };
        if (metrics.fps < 45)
            return { status: 'fair', color: 'text-yellow-500' };
        return { status: 'good', color: 'text-green-500' };
    };
    const memoryStatus = getMemoryStatus();
    const fpsStatus = getFPSStatus();
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-xs font-mono text-white z-50 min-w-[200px]", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Memory:" }), (0, jsx_runtime_1.jsxs)("span", { className: memoryStatus.color, children: [metrics.memoryUsage, "MB"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "FPS:" }), (0, jsx_runtime_1.jsx)("span", { className: fpsStatus.color, children: metrics.fps })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Games:" }), (0, jsx_runtime_1.jsxs)("span", { children: [metrics.renderedGames, "/", metrics.totalGames] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Scroll:" }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(metrics.scrollPosition), "px"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-2 border-t border-gray-700/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${memoryStatus.color}` }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: ["Memory ", memoryStatus.status] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${fpsStatus.color}` }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: ["FPS ", fpsStatus.status] })] })] })] }) }));
}
/**
 * Hook for memory-optimized virtual scrolling metrics
 */
function useVirtualScrollMetrics(totalItems, itemHeight, containerHeight) {
    const [visibleRange, setVisibleRange] = (0, react_1.useState)({ start: 0, end: 0 });
    const [scrollTop, setScrollTop] = (0, react_1.useState)(0);
    // Calculate visible range based on scroll position
    const calculateVisibleRange = (scrollPosition) => {
        const start = Math.max(0, Math.floor(scrollPosition / itemHeight));
        const end = Math.min(totalItems - 1, Math.ceil((scrollPosition + containerHeight) / itemHeight));
        return { start, end };
    };
    const handleScroll = (position) => {
        setScrollTop(position);
        const range = calculateVisibleRange(position);
        setVisibleRange(range);
    };
    const renderedItems = visibleRange.end - visibleRange.start + 1;
    const renderEfficiency = totalItems > 0 ? (renderedItems / totalItems) * 100 : 0;
    return {
        visibleRange,
        scrollTop,
        renderedItems,
        renderEfficiency,
        handleScroll
    };
}
