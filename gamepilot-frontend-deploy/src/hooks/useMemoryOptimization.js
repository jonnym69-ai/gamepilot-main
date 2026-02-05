"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCache = void 0;
exports.useIntersectionObserver = useIntersectionObserver;
exports.useResizeObserver = useResizeObserver;
exports.preloadImage = preloadImage;
exports.useEventListener = useEventListener;
exports.useScrollThrottle = useScrollThrottle;
const react_1 = require("react");
/**
 * Hook for memory-optimized intersection observer with proper cleanup
 */
function useIntersectionObserver(callback, options = {}) {
    const observerRef = (0, react_1.useRef)(null);
    const targetRef = (0, react_1.useRef)(new Set());
    (0, react_1.useEffect)(() => {
        // Create observer with optimized options
        observerRef.current = new IntersectionObserver(callback, {
            threshold: 0.1,
            rootMargin: '50px',
            ...options
        });
        return () => {
            // Cleanup: disconnect observer and clear targets
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
            targetRef.current.clear();
        };
    }, [callback, options]);
    const observe = (element) => {
        if (observerRef.current && element) {
            observerRef.current.observe(element);
            targetRef.current.add(element);
        }
    };
    const unobserve = (element) => {
        if (observerRef.current && element) {
            observerRef.current.unobserve(element);
            targetRef.current.delete(element);
        }
    };
    return { observe, unobserve };
}
/**
 * Hook for memory-optimized resize observer with proper cleanup
 */
function useResizeObserver(callback) {
    const observerRef = (0, react_1.useRef)(null);
    const targetRef = (0, react_1.useRef)(new Set());
    (0, react_1.useEffect)(() => {
        // Create resize observer
        observerRef.current = new ResizeObserver(callback);
        return () => {
            // Cleanup: disconnect observer and clear targets
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
            targetRef.current.clear();
        };
    }, [callback]);
    const observe = (element) => {
        if (observerRef.current && element) {
            observerRef.current.observe(element);
            targetRef.current.add(element);
        }
    };
    const unobserve = (element) => {
        if (observerRef.current && element) {
            observerRef.current.unobserve(element);
            targetRef.current.delete(element);
        }
    };
    return { observe, unobserve };
}
/**
 * Memory-optimized image cache with LRU eviction
 */
class ImageCache {
    constructor(maxSize = 50) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }
    get(url) {
        const image = this.cache.get(url);
        if (image) {
            // Move to end (LRU)
            this.cache.delete(url);
            this.cache.set(url, image);
            return image;
        }
        return null;
    }
    set(url, image) {
        if (this.cache.size >= this.maxSize) {
            // Remove oldest item (LRU)
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(url, image);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
// Global image cache instance
exports.imageCache = new ImageCache();
/**
 * Memory-optimized image preloader with caching
 */
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        // Check cache first
        const cached = exports.imageCache.get(url);
        if (cached) {
            resolve(cached);
            return;
        }
        const img = new Image();
        img.onload = () => {
            exports.imageCache.set(url, img);
            resolve(img);
        };
        img.onerror = reject;
        // Start loading
        img.src = url;
    });
}
/**
 * Memory leak prevention for event listeners
 */
function useEventListener(target, event, handler, options) {
    (0, react_1.useEffect)(() => {
        target.addEventListener(event, handler, options);
        return () => {
            target.removeEventListener(event, handler, options);
        };
    }, [target, event, handler, options]);
}
/**
 * Memory-optimized scroll throttling
 */
function useScrollThrottle(callback, delay = 16) {
    const lastCallRef = (0, react_1.useRef)(0);
    const timeoutRef = (0, react_1.useRef)();
    return () => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
            lastCallRef.current = now;
            callback();
        }
        else {
            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                lastCallRef.current = Date.now();
                callback();
            }, delay - (now - lastCallRef.current));
        }
    };
}
