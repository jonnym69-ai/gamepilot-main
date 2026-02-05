"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryReviewSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const LibraryReviewSection = ({ className = '' }) => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Calculate review metrics
    const totalGames = games.length;
    const recentlyPlayed = games
        .filter(game => game.lastPlayed && typeof game.lastPlayed === 'number')
        .sort((a, b) => b.lastPlayed - a.lastPlayed)
        .slice(0, 3);
    const mostPlayedGames = games
        .filter(game => game.hoursPlayed && game.hoursPlayed > 0)
        .sort((a, b) => b.hoursPlayed - a.hoursPlayed)
        .slice(0, 3);
    const completedGames = games.filter(game => game.playStatus === 'completed');
    // Get games that need attention
    const backlogGames = games.filter(game => game.playStatus === 'backlog');
    const unplayedGames = games.filter(game => game.playStatus === 'unplayed');
    const formatLastPlayed = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days}d ago`;
        if (hours > 0)
            return `${hours}h ago`;
        return 'Just now';
    };
    const formatPlaytime = (hours) => {
        if (hours < 1)
            return '< 1h';
        if (hours < 24)
            return `${Math.floor(hours)}h`;
        if (hours < 168)
            return `${Math.floor(hours / 24)}d`;
        return `${Math.floor(hours / 168)}w`;
    };
    const getRecommendation = (game) => {
        // Simple recommendation based on play status
        if (game.playStatus === 'unplayed')
            return 'New adventure awaits';
        if (game.playStatus === 'backlog')
            return 'Time to explore';
        if (game.playStatus === 'playing')
            return 'Continue your journey';
        if (game.playStatus === 'completed')
            return 'Ready for replay';
        return 'Ready to play';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-2xl p-6 border border-gray-700/30 shadow-2xl backdrop-blur-md ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "\uD83D\uDCDD Library Review" }), (0, jsx_runtime_1.jsx)("div", { className: "ml-auto text-sm text-gray-400", children: "Your gaming insights" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-400 mb-2", children: completedGames }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Completed Games" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: [totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0, "% completion rate"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-400 mb-2", children: backlogGames.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "In Backlog" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Ready to explore" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-400 mb-2", children: unplayedGames.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Unplayed" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "New discoveries" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "\uD83C\uDFAF Quick Recommendations" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: mostPlayedGames.slice(0, 3).map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:bg-gray-800/50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden flex-shrink-0", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium line-clamp-1", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400", children: [formatPlaytime(game.hoursPlayed || 0), " played"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-300 italic", children: getRecommendation(game) })] }, game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "\uD83D\uDD52 Recent Activity" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: recentlyPlayed.slice(0, 3).map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:bg-gray-800/50 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden flex-shrink-0", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium line-clamp-1", children: game.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xs", children: game.genres && game.genres.length > 0 && (typeof game.genres[0] === 'string' ? game.genres[0] : game.genres[0].name) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 mt-1", children: ["Last played ", formatLastPlayed(game.lastPlayed)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: game.hoursPlayed && game.hoursPlayed > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400", children: [Math.floor(game.hoursPlayed), "h total"] })) })] }, game.id))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4 border-t border-gray-700/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 justify-center", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gaming-primary/20 text-gaming-primary rounded-lg hover:bg-gaming-primary/30 transition-all duration-200 text-sm font-medium", children: "\uD83C\uDFAE Browse Library" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-200 text-sm font-medium", children: "\uD83D\uDCCA View Stats" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all duration-200 text-sm font-medium", children: "\uD83C\uDFAF Get Recommendations" })] }) })] }));
};
exports.LibraryReviewSection = LibraryReviewSection;
