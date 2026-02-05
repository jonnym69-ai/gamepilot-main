"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentlyPlayed = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const RecentlyPlayed = ({ games, onGameClick, maxItems = 6 }) => {
    const displayGames = games.slice(0, maxItems);
    const formatLastPlayed = (dateString) => {
        if (!dateString)
            return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        if (diffHours < 1)
            return 'Just now';
        if (diffHours < 24)
            return `${diffHours}h ago`;
        if (diffDays < 7)
            return `${diffDays}d ago`;
        if (diffDays < 30)
            return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString();
    };
    if (games.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83D\uDD50" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No Recent Games" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Start playing games to see your recent activity here." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDD50" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Recently Played" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Jump back into your recent adventures" })] })] }), games.length > maxItems && ((0, jsx_runtime_1.jsxs)("button", { className: "text-accent-400 hover:text-accent-300 transition-colors text-sm font-medium", children: ["View All (", games.length, ")"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: displayGames.map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onGameClick?.(game), className: "group flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer", style: {
                        animationDelay: `${index * 50}ms`
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0", children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) })), game.playStatus && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-1 right-1", children: (0, jsx_runtime_1.jsx)("span", { className: `
                    w-2 h-2 rounded-full block
                    ${game.playStatus === 'playing' ? 'bg-green-500' : ''}
                    ${game.playStatus === 'completed' ? 'bg-blue-500' : ''}
                    ${game.playStatus === 'backlog' ? 'bg-yellow-500' : ''}
                    ${game.playStatus === 'abandoned' ? 'bg-red-500' : ''}
                  ` }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium group-hover:text-gaming-accent transition-colors truncate", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 truncate", children: game.developer || 'Unknown Developer' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mt-1 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["\uD83D\uDCC5 ", formatLastPlayed(game.lastPlayed?.toISOString())] }), game.hoursPlayed && (0, jsx_runtime_1.jsxs)("span", { children: ["\u23F1\uFE0F ", game.hoursPlayed, "h"] }), game.userRating && (0, jsx_runtime_1.jsxs)("span", { children: ["\u2B50 ", game.userRating] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: game.platforms?.slice(0, 2).map((platform) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded text-xs", children: platform.name }, platform.name))) }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                e.stopPropagation();
                                // Handle play action
                            }, className: "w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity opacity-0 group-hover:opacity-100", children: "\u25B6\uFE0F" })] }, game.id))) }), games.some(game => game.playStatus === 'playing') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 pt-6 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-3", children: "Continue Playing" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: games
                            .filter(game => game.playStatus === 'playing')
                            .slice(0, 2)
                            .map((game) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onGameClick?.(game), className: "flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 cursor-pointer hover:border-green-500/40 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium text-sm truncate", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: game.hoursPlayed ? `${game.hoursPlayed}h played` : 'Just started' })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm", children: "\u25B6" })] }, game.id))) })] }))] }));
};
exports.RecentlyPlayed = RecentlyPlayed;
