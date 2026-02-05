"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSearchAnalytics = exports.EnhancedSearchManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const useDebounce_1 = require("../../../hooks/useDebounce");
const EnhancedSearchManager = ({ games, onSearchResults, children }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [isSearching, setIsSearching] = (0, react_1.useState)(false);
    const searchCache = (0, react_1.useRef)({});
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    // Debounced search term for performance
    const debouncedSearchTerm = (0, useDebounce_1.useDebounce)(searchTerm, 300);
    // Advanced search algorithm with multiple strategies
    const performSearch = (0, react_1.useCallback)((term, gameList) => {
        if (!term.trim())
            return gameList;
        const searchLower = term.toLowerCase();
        const searchTerms = term.toLowerCase().split(/\s+/).filter(t => t.length > 0);
        return gameList.filter(game => {
            // Title matching (highest priority)
            const titleMatch = searchTerms.every(term => game.title.toLowerCase().includes(term));
            // Genre matching
            const genreMatch = searchTerms.some(term => game.genres?.some(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name || '';
                return genreName.toLowerCase().includes(term);
            }));
            // Platform matching
            const platformMatch = searchTerms.some(term => game.platforms?.some(platform => (platform.name || '').toLowerCase().includes(term)));
            // Tag matching
            const tagMatch = searchTerms.some(term => game.tags?.some(tag => (tag || '').toLowerCase().includes(term)));
            // Description matching (lower priority)
            const descriptionMatch = searchTerms.some(term => game.description?.toLowerCase().includes(term));
            // Return true if any match type succeeds
            return titleMatch || genreMatch || platformMatch || tagMatch || descriptionMatch;
        }).sort((a, b) => {
            // Sort by relevance: exact title matches first, then partial matches
            const aExact = a.title.toLowerCase() === searchLower;
            const bExact = b.title.toLowerCase() === searchLower;
            if (aExact && !bExact)
                return -1;
            if (!aExact && bExact)
                return 1;
            // Then by title starts with
            const aStarts = a.title.toLowerCase().startsWith(searchLower);
            const bStarts = b.title.toLowerCase().startsWith(searchLower);
            if (aStarts && !bStarts)
                return -1;
            if (!aStarts && bStarts)
                return 1;
            // Finally alphabetical
            return a.title.localeCompare(b.title);
        });
    }, []);
    // Check cache first
    const getCachedResults = (0, react_1.useCallback)((term) => {
        const cached = searchCache.current[term];
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.results;
        }
        return null;
    }, []);
    // Store results in cache
    const setCachedResults = (0, react_1.useCallback)((term, results) => {
        searchCache.current[term] = {
            results,
            timestamp: Date.now()
        };
    }, []);
    // Clean old cache entries
    const cleanCache = (0, react_1.useCallback)(() => {
        const now = Date.now();
        Object.keys(searchCache.current).forEach(key => {
            if (now - searchCache.current[key].timestamp > CACHE_DURATION) {
                delete searchCache.current[key];
            }
        });
    }, []);
    // Perform search when debounced term changes
    react_1.default.useEffect(() => {
        if (debouncedSearchTerm === searchTerm)
            return; // Prevent double execution
        setIsSearching(true);
        // Check cache first
        const cachedResults = getCachedResults(debouncedSearchTerm);
        if (cachedResults) {
            onSearchResults(cachedResults, debouncedSearchTerm);
            setIsSearching(false);
            return;
        }
        // Perform search
        const results = performSearch(debouncedSearchTerm, games);
        // Cache results
        setCachedResults(debouncedSearchTerm, results);
        // Clean old cache entries periodically
        if (Math.random() < 0.1) { // 10% chance to clean cache
            cleanCache();
        }
        // Return results with small delay for perceived performance
        const timeoutId = setTimeout(() => {
            onSearchResults(results, debouncedSearchTerm);
            setIsSearching(false);
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [debouncedSearchTerm, searchTerm, games, performSearch, getCachedResults, setCachedResults, cleanCache, onSearchResults]);
    // Memoized search props
    const searchProps = (0, react_1.useMemo)(() => ({
        searchTerm,
        setSearchTerm,
        isSearching,
        resultCount: games.length
    }), [searchTerm, isSearching, games.length]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children(searchProps), process.env.NODE_ENV === 'development' && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-2 rounded-lg text-xs font-mono border border-gray-700/50 z-40", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Search: ", isSearching ? '🔍' : '✅'] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Cache: ", Object.keys(searchCache.current).length] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Term: \"", debouncedSearchTerm, "\""] })] }))] }));
};
exports.EnhancedSearchManager = EnhancedSearchManager;
// Search analytics hook
const useSearchAnalytics = () => {
    const searchHistory = (0, react_1.useRef)([]);
    const trackSearch = (0, react_1.useCallback)((term, resultCount) => {
        if (term.trim()) {
            searchHistory.current.push({
                term,
                timestamp: Date.now(),
                resultCount
            });
            // Keep only last 50 searches
            if (searchHistory.current.length > 50) {
                searchHistory.current = searchHistory.current.slice(-50);
            }
        }
    }, []);
    const getPopularSearches = (0, react_1.useCallback)(() => {
        const termCounts = searchHistory.current.reduce((acc, search) => {
            acc[search.term] = (acc[search.term] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(termCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([term, count]) => ({ term, count }));
    }, []);
    const getRecentSearches = (0, react_1.useCallback)(() => {
        return searchHistory.current
            .slice(-10)
            .reverse()
            .map(search => search.term);
    }, []);
    return {
        trackSearch,
        getPopularSearches,
        getRecentSearches,
        searchHistory: searchHistory.current
    };
};
exports.useSearchAnalytics = useSearchAnalytics;
