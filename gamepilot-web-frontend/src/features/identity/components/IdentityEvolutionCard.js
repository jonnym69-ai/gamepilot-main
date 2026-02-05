"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityEvolutionCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const usePersonaSnapshot_1 = require("../../../hooks/persona/usePersonaSnapshot");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const IdentityEvolutionCard = ({ theme }) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const personaSnapshot = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Generate real mood trend from recent games
    const getMoodTrend = () => {
        const recentGames = games
            .filter(game => game.lastPlayed)
            .sort((a, b) => new Date(a.lastPlayed).getTime() - new Date(b.lastPlayed).getTime())
            .slice(-7); // Last 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date().getDay();
        return days.map((day, index) => {
            const dayGames = recentGames.filter(game => {
                const gameDay = new Date(game.lastPlayed).getDay();
                return gameDay === (today - index + 7) % 7;
            });
            // Calculate mood intensity based on games played that day
            const avgPlaytime = dayGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0) / Math.max(1, dayGames.length);
            const intensity = Math.min(100, Math.max(20, avgPlaytime * 10 + (dayGames.length * 15)));
            // Determine mood based on game types
            let mood = 'Focused';
            // Helper function to extract tag names
            const getTagName = (tag) => {
                if (typeof tag === 'string')
                    return tag.toLowerCase();
                if (tag && typeof tag === 'object' && tag.name)
                    return tag.name.toLowerCase();
                return '';
            };
            // Helper function to extract genre names
            const getGenreName = (genre) => {
                if (typeof genre === 'string')
                    return genre.toLowerCase();
                if (genre && typeof genre === 'object' && genre.name)
                    return genre.name.toLowerCase();
                return '';
            };
            const tagNames = dayGames.flatMap(g => g.tags?.map(getTagName) || []);
            const genreNames = dayGames.flatMap(g => g.genres?.map(getGenreName) || []);
            if (tagNames.some(t => t.includes('competitive'))) {
                mood = 'Energetic';
            }
            else if (genreNames.some(g => g.includes('creative'))) {
                mood = 'Creative';
            }
            else if (genreNames.some(g => g.includes('puzzle'))) {
                mood = 'Chill';
            }
            return { day, mood, value: Math.round(intensity) };
        });
    };
    // Generate real genre drift from persona data
    const getGenreDrift = () => {
        const recentGames = games.filter(game => game.lastPlayed).slice(-20);
        const olderGames = games.filter(game => game.lastPlayed).slice(0, -20);
        const calculateGenreDistribution = (gameList) => {
            const distribution = {};
            gameList.forEach(game => {
                game.genres?.forEach((genre) => {
                    const genreName = typeof genre === 'string' ? genre : genre.name;
                    distribution[genreName] = (distribution[genreName] || 0) + 1;
                });
            });
            return distribution;
        };
        const recentDist = calculateGenreDistribution(recentGames);
        const olderDist = calculateGenreDistribution(olderGames);
        const totalRecent = Object.values(recentDist).reduce((a, b) => a + b, 0) || 1;
        const totalOlder = Object.values(olderDist).reduce((a, b) => a + b, 0) || 1;
        // Get top 5 genres and calculate drift
        const allGenres = new Set([...Object.keys(recentDist), ...Object.keys(olderDist)]);
        const genreDrift = Array.from(allGenres).slice(0, 5).map(genre => ({
            genre,
            current: Math.round((recentDist[genre] || 0) / totalRecent * 100),
            previous: Math.round((olderDist[genre] || 0) / totalOlder * 100)
        }));
        return genreDrift;
    };
    // Calculate playstyle stability from persona confidence
    const playstyleStability = Math.round((personaSnapshot?.confidence || 0.7) * 100);
    const moodTrend = getMoodTrend();
    const genreDrift = getGenreDrift();
    const getMoodColor = (mood) => {
        const colors = {
            'Focused': 'bg-blue-500',
            'Energetic': 'bg-orange-500',
            'Creative': 'bg-purple-500',
            'Chill': 'bg-green-500'
        };
        return colors[mood] || 'bg-gray-500';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl p-6 border border-white/10 hover:bg-white/5 transition-all duration-300`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCC8" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: "Identity Evolution" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsExpanded(!isExpanded), className: "text-gaming-accent hover:text-white transition-colors text-sm", children: isExpanded ? 'Collapse' : 'Expand' })] }), !isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Mood Trend (7 days)" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gaming-accent", children: "\u2191 12%" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: moodTrend.slice(-5).map((day, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: day.day }), (0, jsx_runtime_1.jsx)("div", { className: `h-2 rounded-full ${getMoodColor(day.mood)} mt-1`, style: { width: `${day.value}%` } })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Genre Preferences" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gaming-accent", children: "Stable" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: genreDrift.slice(0, 3).map((genre, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: genre.genre }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-500", children: [genre.previous, "%"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "\u2192" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [genre.current, "%"] })] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Playstyle Stability" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gaming-accent", children: [playstyleStability, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2 mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: `h-2 rounded-full bg-gradient-to-r ${theme.primary} transition-all duration-500`, style: { width: `${playstyleStability}%` } }) })] })] })), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-semibold text-white mb-3", children: "Mood Evolution (Last 7 Days)" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: moodTrend.map((day, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300 w-8", children: day.day }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white", children: day.mood })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: `h-2 rounded-full ${getMoodColor(day.mood)} transition-all duration-300`, style: { width: `${day.value}%` } }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gaming-accent w-10 text-right", children: [day.value, "%"] })] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-semibold text-white mb-3", children: "Genre Preference Drift" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: genreDrift.map((genre, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: genre.genre }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: ["Previous: ", genre.previous, "%"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gaming-accent", children: ["Current: ", genre.current, "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-gray-700 rounded-full h-1", children: (0, jsx_runtime_1.jsx)("div", { className: "h-1 rounded-full bg-gray-500", style: { width: `${genre.previous}%` } }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-gray-700 rounded-full h-1", children: (0, jsx_runtime_1.jsx)("div", { className: `h-1 rounded-full bg-gradient-to-r ${theme.primary}`, style: { width: `${genre.current}%` } }) })] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-semibold text-white mb-3", children: "Playstyle Consistency" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Stability Score" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-bold text-gaming-accent", children: [playstyleStability, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-3", children: (0, jsx_runtime_1.jsx)("div", { className: `h-3 rounded-full bg-gradient-to-r ${theme.primary} transition-all duration-500`, style: { width: `${playstyleStability}%` } }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: playstyleStability >= 80 ? 'Very consistent playstyle patterns' :
                                            playstyleStability >= 60 ? 'Moderately consistent with some variation' :
                                                'Highly variable playstyle preferences' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4 border-t border-white/10", children: (0, jsx_runtime_1.jsx)("button", { className: `w-full bg-gradient-to-r ${theme.primary} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`, onClick: () => console.log('View full evolution timeline'), children: "View Full Evolution Timeline" }) })] }))] }));
};
exports.IdentityEvolutionCard = IdentityEvolutionCard;
