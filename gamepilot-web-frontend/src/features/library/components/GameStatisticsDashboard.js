"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatisticsDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GameStatisticsDashboard = ({ games, onClose }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('overview');
    const [timeRange, setTimeRange] = (0, react_1.useState)('all');
    const statistics = (0, react_1.useMemo)(() => {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const filterGamesByTime = (games) => {
            switch (timeRange) {
                case 'year':
                    return games.filter(game => game.addedAt >= oneYearAgo);
                case 'month':
                    return games.filter(game => game.addedAt >= oneMonthAgo);
                case 'week':
                    return games.filter(game => game.addedAt >= oneWeekAgo);
                default:
                    return games;
            }
        };
        const filteredGames = filterGamesByTime(games);
        // Basic statistics
        const totalGames = filteredGames.length;
        const totalPlaytime = filteredGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
        const averagePlaytime = totalGames > 0 ? totalPlaytime / totalGames : 0;
        const completedGames = filteredGames.filter(game => game.playStatus === 'completed').length;
        const completionRate = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;
        const favoriteCount = filteredGames.filter(game => game.isFavorite).length;
        const recentlyPlayed = filteredGames.filter(game => game.lastPlayed && (now.getTime() - game.lastPlayed.getTime()) < 7 * 24 * 60 * 60 * 1000).length;
        // Genre distribution
        const genreDistribution = {};
        filteredGames.forEach(game => {
            game.genres?.forEach(genre => {
                genreDistribution[genre.name] = (genreDistribution[genre.name] || 0) + 1;
            });
        });
        // Platform distribution
        const platformDistribution = {};
        filteredGames.forEach(game => {
            game.platforms?.forEach(platform => {
                platformDistribution[platform.name || platform] = (platformDistribution[platform.name || platform] || 0) + 1;
            });
        });
        // Status distribution
        const statusDistribution = {
            unplayed: 0,
            playing: 0,
            completed: 0,
            paused: 0,
            abandoned: 0,
            backlog: 0
        };
        filteredGames.forEach(game => {
            statusDistribution[game.playStatus] = (statusDistribution[game.playStatus] || 0) + 1;
        });
        // Rating distribution
        const ratingDistribution = {};
        filteredGames.forEach(game => {
            if (game.userRating) {
                const rating = Math.floor(game.userRating);
                ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
            }
        });
        // Playtime by genre
        const playtimeByGenre = {};
        filteredGames.forEach(game => {
            if (game.hoursPlayed && game.genres) {
                game.genres.forEach(genre => {
                    playtimeByGenre[genre.name] = (playtimeByGenre[genre.name] || 0) + game.hoursPlayed;
                });
            }
        });
        // Monthly playtime (mock data for now)
        const monthlyPlaytime = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => {
            monthlyPlaytime[month] = Math.random() * 100 + 20; // Mock data
        });
        // Top rated games
        const topRatedGames = filteredGames
            .filter(game => game.userRating && game.userRating >= 4)
            .sort((a, b) => (b.userRating || 0) - (a.userRating || 0))
            .slice(0, 5);
        // Most played games
        const mostPlayedGames = filteredGames
            .filter(game => game.hoursPlayed && game.hoursPlayed > 0)
            .sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0))
            .slice(0, 5);
        // Recently added games
        const recentlyAddedGames = filteredGames
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
            .slice(0, 5);
        return {
            totalGames,
            totalPlaytime,
            averagePlaytime,
            completionRate,
            favoriteCount,
            recentlyPlayed,
            genreDistribution,
            platformDistribution,
            statusDistribution,
            ratingDistribution,
            playtimeByGenre,
            monthlyPlaytime,
            topRatedGames,
            mostPlayedGames,
            recentlyAddedGames
        };
    }, [games, timeRange]);
    const formatHours = (hours) => {
        if (hours < 1) {
            return `${Math.round(hours * 60)}m`;
        }
        else if (hours < 24) {
            return `${hours.toFixed(1)}h`;
        }
        else {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days}d ${remainingHours.toFixed(0)}h`;
        }
    };
    const renderOverview = () => ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Total Games" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: statistics.totalGames })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Total Playtime" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u23F1\uFE0F" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: formatHours(statistics.totalPlaytime) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Completion Rate" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2705" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-white", children: [statistics.completionRate.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Favorites" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2B50" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: statistics.favoriteCount })] })] }));
    const renderGenres = () => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Genre Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(statistics.genreDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([genre, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: genre }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-500 h-2 rounded-full", style: { width: `${(count / statistics.totalGames) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm w-12 text-right", children: count })] })] }, genre))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Playtime by Genre" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(statistics.playtimeByGenre)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([genre, hours]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: genre }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-green-500 h-2 rounded-full", style: { width: `${(hours / statistics.totalPlaytime) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm w-16 text-right", children: formatHours(hours) })] })] }, genre))) })] })] }));
    const renderPlatforms = () => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Platform Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(statistics.platformDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([platform, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: platform }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-purple-500 h-2 rounded-full", style: { width: `${(count / statistics.totalGames) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm w-12 text-right", children: count })] })] }, platform))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Status Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(statistics.statusDistribution).map(([status, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 capitalize", children: status }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-orange-500 h-2 rounded-full", style: { width: `${(count / statistics.totalGames) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm w-12 text-right", children: count })] })] }, status))) })] })] }));
    const renderTimeline = () => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Top Rated Games" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: statistics.topRatedGames.map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 w-6", children: ["#", index + 1] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: game.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: game.genres?.slice(0, 2).map(g => g.name).join(', ') })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400", children: "\u2B50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: game.userRating?.toFixed(1) })] })] }, game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Most Played Games" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: statistics.mostPlayedGames.map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 w-6", children: ["#", index + 1] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: game.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: game.genres?.slice(0, 2).map(g => g.name).join(', ') })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-green-400", children: "\u23F1\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: formatHours(game.hoursPlayed || 0) })] })] }, game.id))) })] })] }));
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Game Statistics Dashboard" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Time Range:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: ['all', 'year', 'month', 'week'].map(range => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setTimeRange(range), className: `px-3 py-1 rounded-lg transition-colors ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: range.charAt(0).toUpperCase() + range.slice(1) }, range))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-4 mb-6 border-b border-gray-700", children: ['overview', 'genres', 'platforms', 'timeline'].map(tab => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab(tab), className: `px-4 py-2 border-b-2 transition-colors capitalize ${activeTab === tab
                            ? 'border-blue-500 text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-300'}`, children: tab }, tab))) }), (0, jsx_runtime_1.jsxs)("div", { className: "min-h-[400px]", children: [activeTab === 'overview' && renderOverview(), activeTab === 'genres' && renderGenres(), activeTab === 'platforms' && renderPlatforms(), activeTab === 'timeline' && renderTimeline()] })] }) }));
};
exports.GameStatisticsDashboard = GameStatisticsDashboard;
