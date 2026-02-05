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
exports.HomeHub = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const SectionSkeleton_1 = require("../../components/ui/SectionSkeleton");
const useGamePilotStore_1 = require("../../stores/useGamePilotStore");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const useNewMoodRecommendations_1 = require("../../hooks/useNewMoodRecommendations");
const SurpriseMeSection_1 = require("./components/SurpriseMeSection");
const WhatShouldIBuySection_1 = require("./components/WhatShouldIBuySection");
const RecentlyPlayedSection_1 = require("./components/RecentlyPlayedSection");
const DebugPanel_1 = require("./components/DebugPanel");
const SimpleMoodSelector_1 = require("../../components/SimpleMoodSelector");
const HomeHub = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // NEW: Contextual filtering state
    const [selectedSessionLength, setSelectedSessionLength] = (0, react_1.useState)(null);
    const [timeOfDay, setTimeOfDay] = (0, react_1.useState)("morning");
    const [selectedMoods, setSelectedMoods] = (0, react_1.useState)([]);
    // Auto-detect time of day
    (0, react_1.useEffect)(() => {
        const detectTimeOfDay = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12)
                return "morning";
            if (hour >= 12 && hour < 17)
                return "afternoon";
            if (hour >= 17 && hour < 22)
                return "evening";
            return "late-night";
        };
        setTimeOfDay(detectTimeOfDay());
        const interval = setInterval(detectTimeOfDay, 60000);
        return () => clearInterval(interval);
    }, []);
    // Get mood/persona data
    const { primaryMood, secondaryMood, intensity, recommendations: moodRecommendations, isLoading: moodRecommendationsLoading, error: moodRecommendationsError, selectMood, clearMood, setIntensity, hasRecommendations } = (0, useNewMoodRecommendations_1.useNewMoodRecommendations)({
        games: [],
        onRecommendationsChange: (recs) => {
            console.log('HomeHub mood recommendations updated:', recs.length);
        }
    });
    // Try to access the store safely
    let games = [];
    let store = null;
    let totalPlaytime = 0;
    let currentSession = null;
    try {
        const storeData = (0, useLibraryStore_1.useLibraryStore)(state => state);
        games = storeData?.games || [];
        store = storeData;
        currentSession = storeData?.currentSession || null;
        const { getTotalPlaytime } = (0, useGamePilotStore_1.useGamePilotStore)();
        totalPlaytime = getTotalPlaytime();
    }
    catch (err) {
        console.error('Store access error:', err);
        setError('Failed to access store');
    }
    // Set loading to false after component mounts
    (0, react_1.useEffect)(() => {
        try {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 100);
            return () => clearTimeout(timer);
        }
        catch (err) {
            console.error('HomeHub initialization error:', err);
            setError('Failed to initialize HomeHub');
            setIsLoading(false);
        }
    }, []);
    // Handle game launching
    const handleLaunchGame = (gameId) => {
        try {
            const storeData = useLibraryStore_1.useLibraryStore.getState();
            const game = storeData?.games?.find(g => g.id === gameId);
            if (game && game.appId) {
                storeData?.actions?.launchGame(game.appId);
            }
            else {
                console.error('Game not found or no appId:', gameId);
            }
        }
        catch (err) {
            console.error('Failed to launch game:', err);
        }
    };
    // NEW: Contextual recommendations logic
    const contextualRecommendations = react_1.default.useMemo(() => {
        if (!games.length)
            return [];
        // Normalize games with contextual data (same logic as LibrarySimple)
        const normalizedGames = games.map(game => {
            const normalizedMoods = (game.moods || [])
                .map((m) => {
                if (typeof m === "string")
                    return m.toLowerCase().trim();
                if (typeof m === "object" && m && "name" in m && typeof m.name === "string")
                    return m.name.toLowerCase().trim();
                return null;
            })
                .filter((m) => m !== null);
            // Auto-tag contextual data
            const existingSessionLength = game.sessionLength;
            const existingRecommendedTimes = game.recommendedTimes;
            let inferredSessionLength = existingSessionLength;
            let inferredRecommendedTimes = existingRecommendedTimes;
            if (!inferredSessionLength) {
                const playtime = game.hoursPlayed || 0;
                if (playtime < 0.5)
                    inferredSessionLength = "short";
                else if (playtime <= 2)
                    inferredSessionLength = "medium";
                else
                    inferredSessionLength = "long";
            }
            if (!inferredRecommendedTimes || inferredRecommendedTimes.length === 0) {
                const times = new Set();
                normalizedMoods.forEach((mood) => {
                    if (["chill", "cozy", "casual", "puzzle", "relaxed"].includes(mood))
                        times.add("late-night");
                    if (["energetic", "competitive", "focused", "intense"].includes(mood))
                        times.add("morning");
                    if (["creative", "immersive", "story-driven", "exploration"].includes(mood)) {
                        times.add("afternoon");
                        times.add("evening");
                    }
                });
                if (times.size === 0)
                    times.add("evening");
                inferredRecommendedTimes = Array.from(times);
            }
            return {
                ...game,
                moods: normalizedMoods,
                sessionLength: inferredSessionLength || "medium",
                recommendedTimes: inferredRecommendedTimes || ["evening"]
            };
        });
        // Filter games based on contextual criteria
        const filtered = normalizedGames.filter(game => {
            const matchesMood = selectedMoods.length === 0 ||
                selectedMoods.some(mood => game.moods.includes(mood));
            const matchesSession = !selectedSessionLength ||
                game.sessionLength === selectedSessionLength;
            const matchesTimeOfDay = !game.recommendedTimes ||
                game.recommendedTimes.includes(timeOfDay);
            return matchesMood && matchesSession && matchesTimeOfDay;
        });
        console.log('Contextual recommendations:', {
            timeOfDay,
            selectedSessionLength,
            selectedMoods,
            totalGames: games.length,
            filteredCount: filtered.length,
            topGames: filtered.slice(0, 5).map(g => g.title)
        });
        return filtered.slice(0, 10);
    }, [games, selectedMoods, selectedSessionLength, timeOfDay]);
    // Error boundary fallback
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-white text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80", children: "Reload Page" })] }) }));
    }
    // Only show loading skeleton if explicitly loading
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(SectionSkeleton_1.SectionSkeleton, {});
    }
    // Main HomeHub layout
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)("header", { className: "mb-12 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent mb-4", children: "GamePilot" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-gray-300 mb-8", children: "Your intelligent gaming companion" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8 flex flex-col items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)(SimpleMoodSelector_1.SimpleMoodSelector, { onMoodChange: (primaryMood, secondaryMood) => {
                                                selectMood(primaryMood, secondaryMood);
                                            }, variant: "compact" }), hasRecommendations && primaryMoodInfo && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [moodRecommendations.length, " recommendations ready"] }))] }), persona && ((0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [persona.traits?.archetypeId, " Playstyle"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-300", children: [Math.round((persona.confidence || 0) * 100), "% confidence \u2022 ", persona.traits?.intensity, " intensity"] })] })] }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/library'), className: "px-6 py-3 bg-gaming-accent text-white rounded-lg font-semibold hover:bg-gaming-accent/80 transition-all", children: "\uD83D\uDCDA View Library" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/identity'), className: "px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all", children: "\uD83D\uDC64 Gaming Identity" })] })] }), hasRecommendations && primaryMoodInfo && ((0, jsx_runtime_1.jsx)("div", { className: "mb-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-2 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: primaryMoodInfo.emoji }), primaryMoodInfo.name, " Recommendations", secondaryMoodInfo && ((0, jsx_runtime_1.jsxs)("span", { className: "text-purple-400", children: ["+ ", secondaryMoodInfo.emoji, " ", secondaryMoodInfo.name] }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Personalized game suggestions for your current mood" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => clearMood(), className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors", children: "Clear Mood" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: moodRecommendations.slice(0, 8).map(game => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleLaunchGame(game.id), className: "group cursor-pointer transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900", children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium text-sm truncate mb-1", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-300", children: [game.hoursPlayed && ((0, jsx_runtime_1.jsxs)("span", { children: ["\u23F1\uFE0F ", game.hoursPlayed, "h"] })), game.userRating && ((0, jsx_runtime_1.jsxs)("span", { children: ["\u2B50 ", game.userRating] }))] })] }) })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white text-sm font-medium mt-2 truncate group-hover:text-gaming-accent transition-colors", children: game.title })] }, game.id))) })] }) })), (0, jsx_runtime_1.jsx)("section", { className: "contextual-recommendations mb-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-500/30 rounded-xl p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-2 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF" }), "Games Perfect for Right Now"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["Based on your mood, available time, and the current time of day (", timeOfDay, ")"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-2", children: "How long do you have?" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [["short", "medium", "long"].map(length => ((0, jsx_runtime_1.jsxs)("button", { className: `px-3 py-1 rounded-lg text-sm transition-all ${selectedSessionLength === length
                                                    ? "bg-blue-600 text-white border border-blue-500"
                                                    : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"}`, onClick: () => setSelectedSessionLength(length), children: [length === "short" && "15–30 min", length === "medium" && "1–2 hours", length === "long" && "2+ hours"] }, length))), selectedSessionLength && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedSessionLength(null), className: "px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition-colors", children: "Clear" }))] })] }), contextualRecommendations.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: contextualRecommendations.map(game => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleLaunchGame(game.id), className: "group cursor-pointer transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900", children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium text-sm truncate mb-1", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-300", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["\u23F1\uFE0F ", game.sessionLength] }), (0, jsx_runtime_1.jsxs)("span", { children: ["\uD83D\uDD50 ", timeOfDay] }), game.hoursPlayed && ((0, jsx_runtime_1.jsxs)("span", { children: ["\uD83D\uDCCA ", game.hoursPlayed, "h"] }))] })] }) })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white text-sm font-medium mt-2 truncate group-hover:text-blue-400 transition-colors", children: game.title })] }, game.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 mb-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-4xl", children: "\uD83C\uDFAF" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-2", children: "No perfect matches found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Try adjusting your session length or browse your full library" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/library'), className: "mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors", children: "Browse Library" })] }))] }) }), (0, jsx_runtime_1.jsx)(SurpriseMeSection_1.SurpriseMeSection, { games: games, onLaunchGame: handleLaunchGame }), (0, jsx_runtime_1.jsx)(WhatShouldIBuySection_1.WhatShouldIBuySection, { games: games }), (0, jsx_runtime_1.jsx)(RecentlyPlayedSection_1.RecentlyPlayedSection, { games: games, onLaunchGame: handleLaunchGame }), (0, jsx_runtime_1.jsx)(DebugPanel_1.DebugPanel, { games: games, store: store, totalPlaytime: totalPlaytime, currentSession: currentSession })] }) }));
};
exports.HomeHub = HomeHub;
