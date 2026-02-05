"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamingStatsDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const GamingStatsDashboard = ({ games, className = '' }) => {
    // Calculate statistics
    const totalGames = games.length;
    const totalPlaytime = games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
    const completedGames = games.filter(game => game.playStatus === 'completed').length;
    const playingGames = games.filter(game => game.playStatus === 'playing').length;
    const backlogGames = games.filter(game => game.playStatus === 'backlog').length;
    const unplayedGames = games.filter(game => game.playStatus === 'unplayed').length;
    // Genre distribution
    const genreDistribution = games.reduce((acc, game) => {
        const genres = game.genres || [];
        genres.forEach(genre => {
            const genreName = typeof genre === 'string' ? genre : genre.name || 'Unknown';
            acc[genreName] = (acc[genreName] || 0) + 1;
        });
        return acc;
    }, {});
    // Platform distribution
    const platformDistribution = games.reduce((acc, game) => {
        const platforms = game.platforms || [];
        platforms.forEach(platform => {
            const platformName = platform.name || 'Unknown';
            acc[platformName] = (acc[platformName] || 0) + 1;
        });
        return acc;
    }, {});
    // Play status distribution
    const statusDistribution = {
        playing: playingGames,
        completed: completedGames,
        backlog: backlogGames,
        unplayed: unplayedGames,
        paused: games.filter(game => game.playStatus === 'paused').length,
        abandoned: games.filter(game => game.playStatus === 'abandoned').length
    };
    // Calculate completion rate
    const completionRate = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;
    // Most played games
    const mostPlayedGames = [...games]
        .sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0))
        .slice(0, 5);
    // Recently played games
    const recentlyPlayedGames = [...games]
        .filter(game => game.lastPlayed)
        .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
        .slice(0, 5);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `space-y-6 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)(StatCard, { title: "Total Games", value: totalGames, icon: "\uD83C\uDFAE", color: "from-blue-500 to-blue-600" }), (0, jsx_runtime_1.jsx)(StatCard, { title: "Total Playtime", value: `${Math.floor(totalPlaytime)}h`, icon: "\u23F1\uFE0F", color: "from-green-500 to-green-600" }), (0, jsx_runtime_1.jsx)(StatCard, { title: "Completed", value: `${completedGames}/${totalGames}`, icon: "\u2705", color: "from-purple-500 to-purple-600" }), (0, jsx_runtime_1.jsx)(StatCard, { title: "Completion Rate", value: `${completionRate.toFixed(1)}%`, icon: "\uD83D\uDCCA", color: "from-orange-500 to-orange-600" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(ChartCard, { title: "Play Status Distribution", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: Object.entries(statusDistribution).map(([status, count]) => {
                                if (count === 0)
                                    return null;
                                const percentage = totalGames > 0 ? (count / totalGames) * 100 : 0;
                                const colors = {
                                    playing: 'from-green-500 to-emerald-600',
                                    completed: 'from-blue-500 to-indigo-600',
                                    backlog: 'from-yellow-500 to-orange-600',
                                    unplayed: 'from-gray-500 to-gray-600',
                                    paused: 'from-orange-500 to-red-600',
                                    abandoned: 'from-red-500 to-gray-600'
                                };
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "capitalize font-medium text-gray-300", children: status }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: [count, " games (", percentage.toFixed(1), "%)"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-3 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full bg-gradient-to-r ${colors[status]} transition-all duration-500`, style: { width: `${percentage}%` } }) })] }, status));
                            }) }) }), (0, jsx_runtime_1.jsx)(ChartCard, { title: "Genre Distribution", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: Object.entries(genreDistribution)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 6)
                                .map(([genre, count]) => {
                                const percentage = totalGames > 0 ? (count / totalGames) * 100 : 0;
                                const colors = [
                                    'from-purple-500 to-pink-600',
                                    'from-blue-500 to-cyan-600',
                                    'from-green-500 to-emerald-600',
                                    'from-yellow-500 to-orange-600',
                                    'from-red-500 to-rose-600',
                                    'from-indigo-500 to-purple-600'
                                ];
                                const colorIndex = Object.keys(genreDistribution).indexOf(genre) % colors.length;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-300", children: genre }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: [count, " games (", percentage.toFixed(1), "%)"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-3 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full bg-gradient-to-r ${colors[colorIndex]} transition-all duration-500`, style: { width: `${percentage}%` } }) })] }, genre));
                            }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(ListCard, { title: "Most Played Games", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: mostPlayedGames.map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm", children: index + 1 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-white text-sm", children: game.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400", children: [Math.floor(game.hoursPlayed || 0), " hours played"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gaming-primary font-bold", children: [Math.floor(game.hoursPlayed || 0), "h"] })] }, game.id))) }) }), (0, jsx_runtime_1.jsx)(ListCard, { title: "Recently Played", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: recentlyPlayedGames.map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-white text-sm", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : 'Never' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-400 text-xs", children: game.lastPlayed ? getRelativeTime(new Date(game.lastPlayed)) : 'Never' })] }, game.id))) }) })] }), (0, jsx_runtime_1.jsx)(ChartCard, { title: "Platform Distribution", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Object.entries(platformDistribution).map(([platform, count]) => {
                        const percentage = totalGames > 0 ? (count / totalGames) * 100 : 0;
                        const platformIcons = {
                            'PC': '🖥️',
                            'Steam': '🎮',
                            'PlayStation': '🎯',
                            'Xbox': '🎪',
                            'Nintendo': '🔥',
                            'Mobile': '📱'
                        };
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl mb-2", children: platformIcons[platform] || '🎮' }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium text-white text-sm", children: platform }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-xs", children: [count, " games"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gaming-primary text-xs font-bold", children: [percentage.toFixed(1), "%"] })] }, platform));
                    }) }) })] }));
};
exports.GamingStatsDashboard = GamingStatsDashboard;
// Helper Components
const StatCard = ({ title, value, icon, color }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: `w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center text-2xl`, children: icon }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: value }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: title })] })] }));
const ChartCard = ({ title, children }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-white mb-4", children: title }), children] }));
const ListCard = ({ title, children }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-white mb-4", children: title }), children] }));
// Helper function for relative time
const getRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0)
        return 'Today';
    if (diffInDays === 1)
        return 'Yesterday';
    if (diffInDays < 7)
        return `${diffInDays} days ago`;
    if (diffInDays < 30)
        return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
};
