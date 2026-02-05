"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePerformanceOptimization = exports.PerformanceOptimizer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PerformanceOptimizer = ({ games, children }) => {
    const renderStartTime = (0, react_1.useRef)(Date.now());
    const frameCount = (0, react_1.useRef)(0);
    const lastFrameTime = (0, react_1.useRef)(Date.now());
    const [fps, setFps] = (0, react_1.useState)(60);
    // Memoized game filtering and sorting for performance
    const optimizedGames = (0, react_1.useMemo)(() => {
        const start = performance.now();
        // Create optimized game objects with only necessary properties for rendering
        const optimized = games.map(game => ({
            ...game,
            // Keep all required properties but limit arrays for performance
            genres: game.genres?.slice(0, 2), // Limit genres for performance
            platforms: game.platforms?.slice(0, 1), // Limit platforms for performance
            subgenres: game.subgenres?.slice(0, 2), // Limit subgenres for performance
            emotionalTags: game.emotionalTags?.slice(0, 3), // Limit emotional tags for performance
            _optimized: true
        }));
        const end = performance.now();
        renderStartTime.current = end - start;
        return optimized;
    }, [games]);
    // FPS monitoring
    (0, react_1.useEffect)(() => {
        let animationId;
        const updateFPS = () => {
            frameCount.current++;
            const currentTime = Date.now();
            const deltaTime = currentTime - lastFrameTime.current;
            if (deltaTime >= 1000) {
                setFps(Math.round((frameCount.current * 1000) / deltaTime));
                frameCount.current = 0;
                lastFrameTime.current = currentTime;
            }
            animationId = requestAnimationFrame(updateFPS);
        };
        animationId = requestAnimationFrame(updateFPS);
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);
    // Memory usage monitoring (if available)
    const memoryUsage = (0, react_1.useMemo)(() => {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
            };
        }
        return { used: 0, total: 0, limit: 0 };
    }, [optimizedGames.length]); // Update when games change
    // Performance metrics
    const performanceMetrics = (0, react_1.useMemo)(() => ({
        totalGames: games.length,
        visibleGames: optimizedGames.length,
        renderTime: renderStartTime.current,
        memoryUsage: memoryUsage.used,
        fps
    }), [games.length, optimizedGames.length, renderStartTime.current, memoryUsage.used, fps]);
    // Preload next batch of images for smoother experience
    (0, react_1.useEffect)(() => {
        const preloadImages = async () => {
            const imageUrls = optimizedGames
                .slice(0, 20) // Preload first 20 images
                .map(game => game.coverImage)
                .filter(Boolean);
            const preloadPromises = imageUrls.map(url => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Resolve even on error to not block
                    img.src = url;
                });
            });
            await Promise.all(preloadPromises);
        };
        preloadImages();
    }, [optimizedGames]);
    // Cleanup function for performance
    (0, react_1.useEffect)(() => {
        return () => {
            // Clear any ongoing operations
            renderStartTime.current = 0;
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children(optimizedGames, performanceMetrics), process.env.NODE_ENV === 'development' && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs font-mono border border-gray-700/50 z-50", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Games: ", performanceMetrics.totalGames] }), (0, jsx_runtime_1.jsxs)("div", { children: ["FPS: ", performanceMetrics.fps] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Render: ", performanceMetrics.renderTime.toFixed(2), "ms"] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Memory: ", performanceMetrics.memoryUsage, "MB"] })] }))] }));
};
exports.PerformanceOptimizer = PerformanceOptimizer;
// Performance optimization hook
const usePerformanceOptimization = (games) => {
    const [isOptimizing, setIsOptimizing] = (0, react_1.useState)(false);
    const optimizationTimeoutRef = (0, react_1.useRef)();
    const optimizeForLargeLibraries = (0, react_1.useCallback)(() => {
        if (games.length > 100) {
            setIsOptimizing(true);
            // Clear any existing timeout
            if (optimizationTimeoutRef.current) {
                clearTimeout(optimizationTimeoutRef.current);
            }
            // Set a timeout to hide optimization indicator
            optimizationTimeoutRef.current = setTimeout(() => {
                setIsOptimizing(false);
            }, 1000);
        }
    }, [games.length]);
    (0, react_1.useEffect)(() => {
        optimizeForLargeLibraries();
        return () => {
            if (optimizationTimeoutRef.current) {
                clearTimeout(optimizationTimeoutRef.current);
            }
        };
    }, [optimizeForLargeLibraries]);
    return {
        isOptimizing,
        shouldUseVirtualScroll: games.length > 50,
        shouldLimitSearchResults: games.length > 200,
        shouldDebounceFilters: games.length > 100
    };
};
exports.usePerformanceOptimization = usePerformanceOptimization;
