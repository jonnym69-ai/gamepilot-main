"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedWorlds = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useFeaturedGames_1 = require("../../hooks/useFeaturedGames");
const launchGame_1 = require("../../utils/launchGame");
const FeaturedWorlds = () => {
    const featuredGames = (0, useFeaturedGames_1.useFeaturedGames)(6);
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
    if (featuredGames.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDF0D" }), "Your Worlds"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "No featured games yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-2", children: "Add games to your library to see them here" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDF0D" }), "Your Worlds"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: featuredGames.map((game, index) => ((0, jsx_runtime_1.jsx)("div", { className: "group cursor-pointer transform transition-all hover:scale-105 animate-fade-in", style: { animationDelay: `${index * 150}ms` }, children: (0, jsx_runtime_1.jsxs)("div", { className: "relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-gaming-accent/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "aspect-video relative", children: [(0, jsx_runtime_1.jsx)("img", { src: game.coverImage || 'https://via.placeholder.com/400x225/1e3a8a/ffffff?text=Game+World', alt: game.title, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 left-3 px-3 py-1 bg-gaming-accent/90 rounded-full", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-xs font-bold", children: "\u2B50 Featured" }) }), game.hoursPlayed && game.hoursPlayed > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium", children: [Math.floor(game.hoursPlayed), "h played"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-bold text-lg mb-3 group-hover:text-gaming-accent transition-colors", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [game.genres && game.genres.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: game.genres.slice(0, 3).map((genre, idx) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gaming-primary/20 rounded text-xs text-gaming-primary", children: genre.name }, idx))) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: game.releaseYear || 'Unknown Year' }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-medium", children: game.playStatus })] })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => handleLaunch(game), className: "w-full mt-4 px-4 py-2 bg-gaming-accent hover:bg-gaming-primary text-white rounded-lg font-medium transition-colors transform hover:scale-105 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u25B6\uFE0F" }), "Play"] })] })] }) }, game.id))) })] }));
};
exports.FeaturedWorlds = FeaturedWorlds;
