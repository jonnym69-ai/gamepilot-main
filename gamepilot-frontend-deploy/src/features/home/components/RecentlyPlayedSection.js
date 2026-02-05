"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentlyPlayedSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const homeHelpers_1 = require("../utils/homeHelpers");
const RecentlyPlayedSection = ({ games, onLaunchGame }) => {
    const recentGames = (0, homeHelpers_1.getRecentlyPlayedGames)(games, 8);
    const formatLastPlayed = (game) => {
        const lastPlayed = game.lastLocalPlayedAt || game.lastPlayed;
        if (!lastPlayed)
            return 'Never';
        const date = new Date(lastPlayed);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
        else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
        else {
            return 'Just now';
        }
    };
    if (recentGames.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "mb-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u23F0" }), "Recently Played"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No recent games" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Start playing some games to see them here!" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("section", { className: "mb-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u23F0" }), "Recently Played"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [recentGames.length, " games"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: recentGames.map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/70 transition-all cursor-pointer group", onClick: () => onLaunchGame(game.id), children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full h-32 overflow-hidden rounded-md bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20 mb-2", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl text-gray-500", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-white text-sm line-clamp-1 group-hover:text-gaming-accent transition-colors", children: game.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: formatLastPlayed(game) }), game.hoursPlayed && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-300", children: ["\u23F1\uFE0F ", Math.floor(game.hoursPlayed), "h"] })), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            onLaunchGame(game.id);
                                        }, className: "w-full mt-2 px-2 py-1 bg-gaming-accent text-white rounded text-xs font-medium hover:bg-gaming-accent/80 transition-colors", children: "Play" })] })] }, game.id))) }) })] }));
};
exports.RecentlyPlayedSection = RecentlyPlayedSection;
