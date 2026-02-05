"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualScroll = VirtualScroll;
exports.useContainerHeight = useContainerHeight;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useMemoryOptimization_1 = require("../hooks/useMemoryOptimization");
function VirtualScroll({ items, itemHeight, containerHeight, renderItem, overscan = 5, className = '' }) {
    const [scrollTop, setScrollTop] = (0, react_1.useState)(0);
    const scrollElementRef = (0, react_1.useRef)(null);
    // Calculate visible range
    const visibleRange = (0, react_1.useMemo)(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);
        return { startIndex, endIndex };
    }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);
    // Handle scroll events with memory-optimized throttling
    const handleScroll = (0, react_1.useCallback)(() => {
        if (scrollElementRef.current) {
            setScrollTop(scrollElementRef.current.scrollTop);
        }
    }, []);
    const throttledScroll = (0, useMemoryOptimization_1.useScrollThrottle)(handleScroll, 16); // ~60fps throttling
    // Calculate total height
    const totalHeight = items.length * itemHeight;
    // Get visible items
    const visibleItems = (0, react_1.useMemo)(() => {
        return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
    }, [items, visibleRange]);
    return ((0, jsx_runtime_1.jsx)("div", { ref: scrollElementRef, className: `overflow-auto ${className}`, style: { height: containerHeight }, onScroll: throttledScroll, children: (0, jsx_runtime_1.jsx)("div", { style: { height: totalHeight, position: 'relative' }, children: visibleItems.map((item, index) => {
                const actualIndex = visibleRange.startIndex + index;
                const translateY = actualIndex * itemHeight;
                return ((0, jsx_runtime_1.jsx)("div", { style: {
                        position: 'absolute',
                        top: translateY,
                        left: 0,
                        right: 0,
                        height: itemHeight,
                    }, children: renderItem(item, actualIndex) }, actualIndex));
            }) }) }));
}
// Hook for responsive container height
function useContainerHeight(defaultHeight = 600) {
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(defaultHeight);
    const containerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const availableHeight = window.innerHeight - rect.top - 100; // Leave some margin
                setContainerHeight(Math.max(400, availableHeight)); // Minimum 400px
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);
    return { containerHeight, containerRef };
}
