"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreBreakdownCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
// Simple Card component to replace UI package dependency
const Card = ({ children, className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-6 cursor-pointer hover:bg-white/15 transition-colors ${className}`, children: children }));
const GenreBreakdownCard = () => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Calculate genre breakdown from games
    const getGenreBreakdown = () => {
        const genreCount = {};
        let totalHours = 0;
        games.forEach(game => {
            const hours = game.hoursPlayed || 0;
            totalHours += hours;
            game.genres?.forEach(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name || genre.description || 'Unknown';
                genreCount[genreName] = (genreCount[genreName] || 0) + hours;
            });
        });
        // Convert to array and calculate percentages
        const breakdown = Object.entries(genreCount)
            .map(([name, hours]) => ({
            name,
            hours,
            percentage: totalHours > 0 ? (hours / totalHours) * 100 : 0,
            gameCount: games.filter(game => game.genres?.some(g => {
                const gName = typeof g === 'string' ? g : g.name || g.description || '';
                return gName === name;
            })).length
        }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 5);
        return breakdown;
    };
    const genreBreakdown = getGenreBreakdown();
    const getGenreColor = (index) => {
        const colors = [
            'from-purple-500 to-pink-500',
            'from-blue-500 to-cyan-500',
            'from-green-500 to-teal-500',
            'from-yellow-500 to-orange-500',
            'from-red-500 to-pink-500'
        ];
        return colors[index % colors.length];
    };
    const formatHours = (hours) => {
        if (hours < 1)
            return '< 1h';
        if (hours < 24)
            return `${Math.floor(hours)}h`;
        if (hours < 24 * 7)
            return `${Math.floor(hours / 24)}d`;
        return `${Math.floor(hours / (24 * 7))}w`;
    };
    return ((0, jsx_runtime_1.jsx)(Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: "Genre Breakdown" })] }), genreBreakdown.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: genreBreakdown.map((genre, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full bg-gradient-to-r ${getGenreColor(index)}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: genre.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-gaming-accent font-semibold", children: [genre.percentage.toFixed(1), "%"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400", children: [genre.gameCount, " games \u2022 ", formatHours(genre.hours)] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-2 rounded-full bg-gradient-to-r ${getGenreColor(index)} transition-all duration-1000 ease-out`, style: { width: `${genre.percentage}%` }, children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-white/20" }) }) })] }, genre.name))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-400 py-8", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-4xl", children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-2", children: "No genre data available" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Add games to your library to see genre breakdown" })] })), genreBreakdown.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-gaming-accent", children: genreBreakdown.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "Genres" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-gaming-accent", children: games.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "Games" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-bold text-gaming-accent", children: formatHours(games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0)) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "Total Hours" })] })] }) }))] }) }));
};
exports.GenreBreakdownCard = GenreBreakdownCard;
