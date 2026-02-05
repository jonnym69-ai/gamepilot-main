"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeHub = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../../store/authStore");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const api_1 = require("../../config/api");
// Import new components
const ErrorBoundary_1 = require("../../components/ErrorBoundary");
const Loading_1 = require("../../components/Loading");
const ThemeToggle_1 = require("../../components/ThemeToggle");
// Import existing components to reuse
const RecentlyPlayedSection_1 = require("./components/RecentlyPlayedSection");
const SurpriseMeSection_1 = require("./components/SurpriseMeSection");
const WhatShouldIBuySection_1 = require("./components/WhatShouldIBuySection");
// Mock data for recently played (will be replaced with real Steam data)
const mockRecentlyPlayed = [
    {
        id: '1',
        title: 'Cyberpunk 2077',
        coverImage: (0, api_1.createApiUrl)('/placeholder/cover/cyberpunk.jpg'),
        playStatus: 'playing',
        hoursPlayed: 45.5,
        lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        addedAt: new Date(),
        isFavorite: false,
        genres: [],
        subgenres: [],
        platforms: [],
        emotionalTags: [],
        releaseYear: 2020
    },
    {
        id: '2',
        title: 'Baldur\'s Gate 3',
        coverImage: (0, api_1.createApiUrl)('/placeholder/cover/baldurs3.jpg'),
        playStatus: 'completed',
        hoursPlayed: 120.3,
        lastPlayed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        addedAt: new Date(),
        isFavorite: true,
        genres: [],
        subgenres: [],
        platforms: [],
        emotionalTags: [],
        releaseYear: 2023
    },
    {
        id: '3',
        title: 'Helldivers 2',
        coverImage: (0, api_1.createApiUrl)('/placeholder/cover/helldivers2.jpg'),
        playStatus: 'paused',
        hoursPlayed: 25.7,
        lastPlayed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        addedAt: new Date(),
        isFavorite: false,
        genres: [],
        subgenres: [],
        platforms: [],
        emotionalTags: [],
        releaseYear: 2024
    }
];
// Mock recommendations (static logic for v1)
const mockRecommendations = [
    {
        id: '4',
        title: 'Elden Ring',
        reason: 'Based on your love for challenging RPGs',
        confidence: 0.92,
        coverImage: (0, api_1.createApiUrl)('/placeholder/cover/eldenring.jpg'),
        genres: ['RPG', 'Action'],
        mood: 'strategic'
    },
    {
        id: '5',
        title: 'Hades',
        reason: 'Perfect for your competitive gaming sessions',
        confidence: 0.88,
        coverImage: (0, api_1.createApiUrl)('/placeholder/cover/hades.jpg'),
        genres: ['Roguelike', 'Action'],
        mood: 'competitive'
    },
    {
        id: '6',
        title: 'Stardew Valley',
        reason: 'Great for relaxing gaming sessions',
        confidence: 0.85,
        coverImage: (0, api_1.createApiUrl)('/placeholder/cover/stardew.jpg'),
        genres: ['Simulation', 'Casual'],
        mood: 'relaxed'
    }
];
const HomeHub = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { user } = (0, authStore_1.useAuth)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    // Get library data
    const { games } = (0, useLibraryStore_1.useLibraryStore)(state => state);
    // Simulate loading and data fetching
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Simulate API call
        return () => clearTimeout(timer);
    }, []);
    // Handle game launching
    const handleLaunchGame = (gameId) => {
        const game = games?.find(g => g.id === gameId);
        if (game) {
            console.log(`🎮 Launching game: ${game.title}`);
            // In a real implementation, this would launch the game
            // For now, just navigate to game detail
            navigate(`/game/${gameId}`);
        }
    };
    // Loading state
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "Loading your Home Hub...", size: "xl" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 6 }).map((_, index) => ((0, jsx_runtime_1.jsx)(Loading_1.CardSkeleton, {}, index))) })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: [(0, jsx_runtime_1.jsxs)("header", { className: "relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-gaming-primary/20 via-gaming-secondary/10 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/40" })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 container mx-auto px-4 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl p-8 border border-white/10 backdrop-blur-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [user?.username ? ((0, jsx_runtime_1.jsx)("img", { src: user.username, alt: user.username, className: "w-16 h-16 rounded-full border-2 border-gaming-primary/50 object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-br from-gaming-primary to-gaming-secondary rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-xl font-bold", children: user?.username?.charAt(0)?.toUpperCase() || 'G' }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl sm:text-3xl font-bold text-white mb-1", children: ["Welcome back, ", user?.username || 'Gamer', "!"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm sm:text-base", children: "Ready to continue your gaming journey?" })] })] }), (0, jsx_runtime_1.jsx)(ThemeToggle_1.ThemeToggle, { size: "md" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-6 border-t border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-gaming-primary", children: games?.length || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Games" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-gaming-secondary", children: "0" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Hours Played" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-green-400", children: "5" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Achievements" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-purple-400", children: "3" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "New Games" })] })] }) })] }) })] }), (0, jsx_runtime_1.jsxs)("main", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold text-white flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }), "Recently Played"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/library'), className: "text-gaming-primary hover:text-gaming-primary/80 transition-colors text-sm font-medium", children: "View All \u2192" })] }), (0, jsx_runtime_1.jsx)(RecentlyPlayedSection_1.RecentlyPlayedSection, { games: mockRecentlyPlayed, onLaunchGame: handleLaunchGame })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD17" }), "Quick Links"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => navigate('/integrations'), className: "w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-between group", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("span", { children: "Steam" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-blue-200 group-hover:text-white transition-colors", children: "Connect \u2192" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => navigate('/integrations'), className: "w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-between group", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDCAC" }), (0, jsx_runtime_1.jsx)("span", { children: "Discord" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-indigo-200 group-hover:text-white transition-colors", children: "Connect \u2192" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => navigate('/integrations'), className: "w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-between group", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDCFA" }), (0, jsx_runtime_1.jsx)("span", { children: "YouTube" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-red-200 group-hover:text-white transition-colors", children: "Connect \u2192" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => navigate('/integrations'), className: "w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-between group", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDCFA" }), (0, jsx_runtime_1.jsx)("span", { children: "Twitch" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-purple-200 group-hover:text-white transition-colors", children: "Connect \u2192" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF" }), "Recommended for You"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: mockRecommendations.map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group", onClick: () => navigate(`/game/${game.id}`), children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover", onError: (e) => {
                                                                        e.currentTarget.src = (0, api_1.createApiUrl)('/placeholder/cover/default.jpg');
                                                                    } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-1 group-hover:text-gaming-primary transition-colors", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mb-2", children: game.reason }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded-full", children: [game.confidence, "% match"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full", children: game.mood })] })] })] }, game.id))) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/discover'), className: "w-full mt-4 px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80 transition-colors", children: "Discover More Games \u2192" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsx)(SurpriseMeSection_1.SurpriseMeSection, { games: games || [], onLaunchGame: handleLaunchGame }), (0, jsx_runtime_1.jsx)(WhatShouldIBuySection_1.WhatShouldIBuySection, { games: games || [] })] })] })] }) }));
};
exports.HomeHub = HomeHub;
