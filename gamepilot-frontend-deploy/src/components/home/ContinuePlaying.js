"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinuePlaying = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const launchGame_1 = require("../../utils/launchGame");
const ContinuePlaying = ({ games }) => {
    // Get last 5 games sorted by playtime
    const recentGames = games
        .sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0))
        .slice(0, 5);
    const handleLaunch = (game) => {
        // Extract appId from game.id (Steam games use format "steam-{appId}")
        const appIdMatch = game.id?.toString().match(/^steam-(\d+)$/);
        const appId = appIdMatch ? parseInt(appIdMatch[1], 10) : null;
        if (appId) {
            (0, launchGame_1.launchGame)(appId);
        }
        else {
            console.warn('No valid appId found for game:', game.title);
        }
    };
    if (recentGames.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u25B6\uFE0F" }), "Continue Playing"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "No games in your library yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-2", children: "Import your Steam games to get started" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u25B6\uFE0F" }), "Continue Playing"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6", children: recentGames.map((game, index) => ((0, jsx_runtime_1.jsx)("div", { className: "group cursor-pointer transform transition-all hover:scale-105 animate-fade-in", style: { animationDelay: `${index * 100}ms` }, children: (0, jsx_runtime_1.jsxs)("div", { className: "relative overflow-hidden rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gaming-accent/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "aspect-video relative", children: [(0, jsx_runtime_1.jsx)("img", { src: game.coverImage || 'https://via.placeholder.com/300x400/1e3a8a/ffffff?text=Game', alt: game.title, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 px-2 py-1 bg-gaming-accent/90 rounded text-xs text-white font-medium", children: game.hoursPlayed ? `${Math.floor(game.hoursPlayed)}h` : 'New' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold text-sm mb-2 line-clamp-2", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-xs", children: game.platforms?.[0]?.name || 'Unknown Platform' }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent text-xs font-medium", children: game.playStatus })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => handleLaunch(game), className: "w-full px-3 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded text-xs font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u25B6\uFE0F" }), "Play"] })] })] }) }, game.id))) })] }));
};
exports.ContinuePlaying = ContinuePlaying;
