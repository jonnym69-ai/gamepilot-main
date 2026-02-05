"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreAffinityLearning = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GenreAffinityLearning = ({ games }) => {
    const [isLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // Calculate genre affinity based on user behavior
    const calculateGenreAffinity = (0, react_1.useMemo)(() => {
        if (!games || games.length === 0)
            return [];
        const genreMap = {};
        games.forEach(game => {
            game.genres?.forEach(genre => {
                const genreName = genre.name;
                if (!genreMap[genreName]) {
                    genreMap[genreName] = {
                        genre: genreName,
                        affinity: 0,
                        playtime: 0,
                        rating: 0,
                        frequency: 0,
                        lastPlayed: null,
                        trend: 'stable'
                    };
                }
                // Update affinity based on playtime
                if (game.hoursPlayed) {
                    genreMap[genreName].playtime += game.hoursPlayed;
                    genreMap[genreName].affinity += Math.min(game.hoursPlayed / 10, 5); // Cap at 5 points per 10 hours
                }
                // Update affinity based on rating
                if (game.userRating) {
                    genreMap[genreName].rating += game.userRating;
                    genreMap[genreName].affinity += (game.userRating - 3) * 2; // Rating bonus/penalty
                }
                // Update frequency
                genreMap[genreName].frequency += 1;
                // Update last played
                if (game.lastPlayed && (!genreMap[genreName].lastPlayed || game.lastPlayed > genreMap[genreName].lastPlayed)) {
                    genreMap[genreName].lastPlayed = game.lastPlayed;
                }
            });
        });
        // Calculate trends
        Object.values(genreMap).forEach(affinity => {
            const recentGames = games.filter(game => game.genres?.some(g => g.name === affinity.genre) &&
                game.lastPlayed &&
                game.lastPlayed > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            );
            const olderGames = games.filter(game => game.genres?.some(g => g.name === affinity.genre) &&
                game.lastPlayed &&
                game.lastPlayed < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
            if (recentGames.length > olderGames.length) {
                affinity.trend = 'increasing';
            }
            else if (recentGames.length < olderGames.length) {
                affinity.trend = 'decreasing';
            }
            else {
                affinity.trend = 'stable';
            }
        });
        return Object.values(genreMap).sort((a, b) => b.affinity - a.affinity);
    }, [games]);
    // Get genre insights
    const getGenreInsights = (0, react_1.useMemo)(() => {
        const insights = [];
        const affinities = calculateGenreAffinity;
        if (affinities.length === 0)
            return insights;
        // Top genres
        const topGenres = affinities.slice(0, 3);
        topGenres.forEach((affinity, index) => {
            insights.push({
                genre: affinity.genre,
                affinity: Math.round(affinity.affinity),
                description: `Your #${index + 1} favorite genre with ${Math.round(affinity.affinity)} affinity score`,
                recommendation: `Continue exploring ${affinity.genre} games`,
                icon: '🎯',
                color: '#10B981'
            });
        });
        // Hidden gems (high affinity, low playtime)
        const hiddenGems = affinities.filter(affinity => affinity.affinity > 15 && affinity.playtime < 5).slice(0, 2);
        hiddenGems.forEach(gem => {
            insights.push({
                genre: gem.genre,
                affinity: Math.round(gem.affinity),
                description: `Undiscovered ${gem.genre} gem with high affinity`,
                recommendation: `Try this ${gem.genre} game you haven't played much`,
                icon: '💎',
                color: '#8B5CF6'
            });
        });
        // Trending genres
        const trendingGenres = affinities.filter(affinity => affinity.trend === 'increasing').slice(0, 2);
        trendingGenres.forEach(trend => {
            insights.push({
                genre: trend.genre,
                affinity: Math.round(trend.affinity),
                description: `Trending ${trend.genre} in your library`,
                recommendation: `Explore more ${trend.genre} games`,
                icon: '🔥',
                color: '#F59E0B'
            });
        });
        return insights;
    }, [calculateGenreAffinity]);
    // Get genre statistics
    const getGenreStatistics = () => {
        const affinities = calculateGenreAffinity;
        if (affinities.length === 0) {
            return {
                uniqueGenres: 0,
                averageAffinity: 0,
                averagePlaytime: 0,
                averageRating: 0,
                totalGames: games.length
            };
        }
        return {
            uniqueGenres: affinities.length,
            averageAffinity: Math.round(affinities.reduce((sum, a) => sum + a.affinity, 0) / affinities.length),
            averagePlaytime: Math.round(affinities.reduce((sum, a) => sum + a.playtime, 0) / affinities.length),
            averageRating: Math.round(affinities.reduce((sum, a) => sum + a.rating, 0) / affinities.length),
            totalGames: games.length
        };
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-white text-xl", children: "Analyzing your genre preferences..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Genre Analysis Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setError(null), className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80", children: "Try Again" })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Your Genre Affinity" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Learning from your gaming behavior and preferences" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Genre Preferences" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: calculateGenreAffinity.slice(0, 9).map((affinity, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: index + 1 }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: affinity.genre }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [affinity.frequency, " games \u2022 ", Math.round(affinity.playtime), "h played"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", style: { color: '#10B981' }, children: Math.round(affinity.affinity) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-transparent to-currentMoodDisplay.color rounded-full", style: { width: `${Math.min(affinity.affinity, 100)}%` } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Trend" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [affinity.trend === 'increasing' && '📈 Increasing', affinity.trend === 'decreasing' && '📉 Decreasing', affinity.trend === 'stable' && '📊 Stable'] })] })] }, affinity.genre))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Gaming Insights" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: getGenreInsights.map((insight, index) => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: insight.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium mb-1", children: insight.description }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-2", children: insight.recommendation }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["Affinity: ", insight.affinity, " \u2022 ", insight.genre] })] })] }) }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Detailed Analysis" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400 mb-4", children: ["Based on your ", games.length, " games in library"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white mb-2", children: calculateGenreAffinity.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Unique Genres" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white mb-2", children: getGenreStatistics().averageAffinity }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Avg Affinity" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white mb-2", children: getGenreStatistics().averagePlaytime }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Avg Hours" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white mb-2", children: getGenreStatistics().averageRating }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Avg Rating" })] })] })] })] }));
};
exports.GenreAffinityLearning = GenreAffinityLearning;
