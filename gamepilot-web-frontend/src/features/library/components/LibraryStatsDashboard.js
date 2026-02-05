"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryStatsDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const LibraryStatsDashboard = ({ className = '' }) => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Calculate stats
    const totalGames = games.length;
    const steamGames = games.filter(game => game.appId && game.appId > 0).length;
    const completedGames = games.filter(game => game.playStatus === 'completed').length;
    const totalPlaytime = games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
    // Genre distribution
    const genreCounts = games.reduce((acc, game) => {
        if (game.genres && game.genres.length > 0) {
            const genre = typeof game.genres[0] === 'string' ? game.genres[0] : game.genres[0].name;
            acc[genre] = (acc[genre] || 0) + 1;
        }
        return acc;
    }, {});
    const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
    // Recent activity (using id as fallback for sorting)
    const recentlyAdded = games
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 5);
    const formatPlaytime = (hours) => {
        if (hours < 1)
            return '< 1h';
        if (hours < 24)
            return `${Math.floor(hours)}h`;
        if (hours < 168)
            return `${Math.floor(hours / 24)}d`;
        return `${Math.floor(hours / 168)}w`;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-2xl p-6 border border-gray-700/30 shadow-2xl backdrop-blur-md ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "\uD83D\uDCCA Library Stats" }), (0, jsx_runtime_1.jsx)("div", { className: "ml-auto text-sm text-gray-400", children: "Your gaming overview" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white mb-1", children: totalGames }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Total Games" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-green-400 mb-1", children: steamGames }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Steam Games" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-blue-400 mb-1", children: completedGames }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-purple-400 mb-1", children: formatPlaytime(totalPlaytime) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Total Playtime" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "\uD83C\uDFAE Top Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-3 flex-wrap", children: topGenres.map(([genre, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white text-sm font-medium", children: genre }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-xs ml-2", children: ["(", count, ")"] })] }, genre))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "\uD83D\uDD52 Recently Added" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: recentlyAdded.slice(0, 3).map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:bg-gray-800/50 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden flex-shrink-0", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium line-clamp-1", children: game.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xs", children: game.genres && game.genres.length > 0 && (typeof game.genres[0] === 'string' ? game.genres[0] : game.genres[0].name) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: game.playStatus && ((0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded text-xs font-medium ${game.playStatus === 'completed' ? 'bg-green-600/30 text-green-300' :
                                                    game.playStatus === 'playing' ? 'bg-blue-600/30 text-blue-300' :
                                                        game.playStatus === 'backlog' ? 'bg-yellow-600/30 text-yellow-300' :
                                                            'bg-gray-600/30 text-gray-300'}`, children: game.playStatus })) }), game.hoursPlayed && game.hoursPlayed > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400 mt-1", children: formatPlaytime(game.hoursPlayed) }))] })] }, game.id))) })] })] }));
};
exports.LibraryStatsDashboard = LibraryStatsDashboard;
